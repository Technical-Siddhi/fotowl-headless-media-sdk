import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MediaAsset, MediaProvider, MediaSDK, ProviderError } from '@fotowl/media-core';
import { MediaSDKProvider, useCuratedMedia } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '999',
  type: 'photo',
  title: 'Curated Photo',
  url: 'https://example.com/999',
  previewUrl: 'https://example.com/999/preview.jpg',
  downloadUrl: 'https://example.com/999/original.jpg',
  width: 1200,
  height: 800,
  author: { name: 'Charlie' },
  src: {
    original: 'https://example.com/999/original.jpg',
    large: 'https://example.com/999/large.jpg',
    medium: 'https://example.com/999/medium.jpg',
    small: 'https://example.com/999/small.jpg',
    tiny: 'https://example.com/999/tiny.jpg',
  },
};

describe('useCuratedMedia Hook', () => {
  const createMockSdk = (curatedImpl?: any) => {
    const provider: MediaProvider = {
      name: 'mock',
      search: vi.fn(),
      curated: curatedImpl || vi.fn().mockResolvedValue({
        assets: [mockAsset],
        pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
      }),
      getById: vi.fn(),
    };
    return { sdk: new MediaSDK({ apiKey: 'test-key', provider, enableDefaultLogger: false }), provider };
  };

  it('fetches curated media successfully', async () => {
    const { sdk } = createMockSdk();

    const { result } = renderHook(() => useCuratedMedia({ page: 1 }), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.assets[0].id).toBe('999');
    expect(result.current.error).toBeNull();
  });

  it('handles provider error', async () => {
    const mockError = new ProviderError('Server failure', 500, 'pexels');
    const curatedImpl = vi.fn().mockRejectedValue(mockError);
    const { sdk } = createMockSdk(curatedImpl);

    const { result } = renderHook(() => useCuratedMedia(), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(mockError);
  });

  it('supports refetch()', async () => {
    const curatedImpl = vi.fn().mockResolvedValue({
      assets: [mockAsset],
      pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
    });
    const { sdk } = createMockSdk(curatedImpl);

    const { result } = renderHook(() => useCuratedMedia({ page: 1 }), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(curatedImpl).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(curatedImpl).toHaveBeenCalledTimes(2);
  });
});
