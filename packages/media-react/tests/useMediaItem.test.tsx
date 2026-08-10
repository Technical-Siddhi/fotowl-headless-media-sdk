import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MediaAsset, MediaProvider, MediaSDK, ValidationError } from '@fotowl/media-core';
import { MediaSDKProvider, useMediaItem } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '333',
  type: 'photo',
  title: 'Single Photo',
  url: 'https://example.com/333',
  previewUrl: 'https://example.com/333/preview.jpg',
  downloadUrl: 'https://example.com/333/original.jpg',
  width: 1000,
  height: 1000,
  author: { name: 'Dan' },
  src: {
    original: 'https://example.com/333/original.jpg',
    large: 'https://example.com/333/large.jpg',
    medium: 'https://example.com/333/medium.jpg',
    small: 'https://example.com/333/small.jpg',
    tiny: 'https://example.com/333/tiny.jpg',
  },
};

describe('useMediaItem Hook', () => {
  const createMockSdk = (getByIdImpl?: any) => {
    const provider: MediaProvider = {
      name: 'mock',
      search: vi.fn(),
      curated: vi.fn(),
      getById: getByIdImpl || vi.fn().mockResolvedValue(mockAsset),
    };
    return { sdk: new MediaSDK({ apiKey: 'test-key', provider, enableDefaultLogger: false }), provider };
  };

  it('fetches a single media asset by ID', async () => {
    const { sdk } = createMockSdk();

    const { result } = renderHook(() => useMediaItem('333'), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.id).toBe('333');
    expect(result.current.data?.title).toBe('Single Photo');
  });

  it('re-fetches asset when ID changes', async () => {
    const getByIdFn = vi.fn().mockImplementation((id) =>
      Promise.resolve({ ...mockAsset, id: String(id), title: `Photo ${id}` })
    );
    const { sdk } = createMockSdk(getByIdFn);

    const { result, rerender } = renderHook(({ id }) => useMediaItem(id), {
      initialProps: { id: '333' },
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.data?.id).toBe('333'));

    rerender({ id: '444' });

    await waitFor(() => expect(result.current.data?.id).toBe('444'));
    expect(result.current.data?.title).toBe('Photo 444');
  });

  it('handles validation error when ID is empty', async () => {
    const mockError = new ValidationError('Media ID must be provided');
    const getByIdImpl = vi.fn().mockRejectedValue(mockError);
    const { sdk } = createMockSdk(getByIdImpl);

    const { result } = renderHook(() => useMediaItem('bad-id'), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe(mockError);
  });

  it('supports refetch()', async () => {
    const getByIdImpl = vi.fn().mockResolvedValue(mockAsset);
    const { sdk } = createMockSdk(getByIdImpl);

    const { result } = renderHook(() => useMediaItem('333'), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getByIdImpl).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(getByIdImpl).toHaveBeenCalledTimes(2);
  });
});
