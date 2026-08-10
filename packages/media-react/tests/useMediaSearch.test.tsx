import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AuthenticationError, MediaAsset, MediaProvider, MediaSDK } from '@fotowl/media-core';
import { MediaSDKProvider, useMediaSearch } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '505',
  type: 'photo',
  title: 'Search Photo',
  url: 'https://example.com/505',
  previewUrl: 'https://example.com/505/preview.jpg',
  downloadUrl: 'https://example.com/505/original.jpg',
  width: 1920,
  height: 1080,
  author: { name: 'Bob' },
  src: {
    original: 'https://example.com/505/original.jpg',
    large: 'https://example.com/505/large.jpg',
    medium: 'https://example.com/505/medium.jpg',
    small: 'https://example.com/505/small.jpg',
    tiny: 'https://example.com/505/tiny.jpg',
  },
};

describe('useMediaSearch Hook', () => {
  const createMockSdk = (searchImpl?: any) => {
    const provider: MediaProvider = {
      name: 'mock',
      search: searchImpl || vi.fn().mockResolvedValue({
        assets: [mockAsset],
        pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
      }),
      curated: vi.fn(),
      getById: vi.fn(),
    };
    return { sdk: new MediaSDK({ apiKey: 'test-key', provider, enableDefaultLogger: false }), provider };
  };

  it('fetches search data and manages loading/data state', async () => {
    const { sdk } = createMockSdk();

    const { result } = renderHook(() => useMediaSearch({ query: 'mountains', page: 1 }), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.assets).toHaveLength(1);
    expect(result.current.data?.assets[0].id).toBe('505');
    expect(result.current.error).toBeNull();
  });

  it('handles error state and preserves typed MediaSDKError hierarchy', async () => {
    const mockError = new AuthenticationError('Invalid API Key', 401);
    const searchImpl = vi.fn().mockRejectedValue(mockError);
    const { sdk } = createMockSdk(searchImpl);

    const { result } = renderHook(() => useMediaSearch({ query: 'fail' }), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
    expect(result.current.error).toBeInstanceOf(AuthenticationError);
  });

  it('re-executes search when parameters change', async () => {
    const searchFn = vi.fn().mockImplementation((params) =>
      Promise.resolve({
        assets: [{ ...mockAsset, title: `Query: ${params.query}` }],
        pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
      })
    );
    const { sdk } = createMockSdk(searchFn);

    const { result, rerender } = renderHook(
      ({ query }) => useMediaSearch({ query }),
      {
        initialProps: { query: 'cats' },
        wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
      }
    );

    await waitFor(() => expect(result.current.data?.assets[0].title).toBe('Query: cats'));

    rerender({ query: 'dogs' });

    await waitFor(() => expect(result.current.data?.assets[0].title).toBe('Query: dogs'));
  });

  it('supports manual refetch()', async () => {
    const searchFn = vi.fn().mockResolvedValue({
      assets: [mockAsset],
      pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
    });
    const { sdk } = createMockSdk(searchFn);

    const { result } = renderHook(() => useMediaSearch({ query: 'lakes' }), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(searchFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(searchFn).toHaveBeenCalledTimes(2);
  });

  it('prevents stale out-of-order async requests from overwriting newer state', async () => {
    let resolveFirst: (val: any) => void;
    let resolveSecond: (val: any) => void;

    const firstPromise = new Promise((resolve) => {
      resolveFirst = resolve;
    });
    const secondPromise = new Promise((resolve) => {
      resolveSecond = resolve;
    });

    const searchFn = vi.fn()
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);

    const { sdk } = createMockSdk(searchFn);

    const { result, rerender } = renderHook(
      ({ query }) => useMediaSearch({ query }),
      {
        initialProps: { query: 'slow-first' },
        wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
      }
    );

    rerender({ query: 'fast-second' });

    // Resolve second request first
    await act(async () => {
      resolveSecond!({
        assets: [{ ...mockAsset, title: 'Second Request Result' }],
        pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
      });
      await secondPromise;
    });

    await waitFor(() => expect(result.current.data?.assets[0].title).toBe('Second Request Result'));

    // Resolve first (stale) request after second has already resolved
    await act(async () => {
      resolveFirst!({
        assets: [{ ...mockAsset, title: 'Stale First Result' }],
        pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
      });
      await firstPromise;
    });

    // State MUST remain as 'Second Request Result', ignoring stale first resolution
    expect(result.current.data?.assets[0].title).toBe('Second Request Result');
  });
});
