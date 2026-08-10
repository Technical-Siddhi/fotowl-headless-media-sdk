import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MediaAsset, MediaSDK } from '@fotowl/media-core';
import { MediaSDKProvider, useMediaEvent } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '101',
  type: 'photo',
  title: 'Event Asset',
  url: 'https://example.com/101',
  previewUrl: 'https://example.com/101/preview.jpg',
  downloadUrl: 'https://example.com/101/download.jpg',
  width: 500,
  height: 500,
  author: { name: 'Eve' },
  src: {
    original: 'https://example.com/101/original.jpg',
    large: 'https://example.com/101/large.jpg',
    medium: 'https://example.com/101/medium.jpg',
    small: 'https://example.com/101/small.jpg',
    tiny: 'https://example.com/101/tiny.jpg',
  },
};

describe('useMediaEvent Hook', () => {
  it('subscribes to SDK event and calls handler when event is emitted', () => {
    const sdk = new MediaSDK({ apiKey: 'test-key', enableDefaultLogger: false });
    const handler = vi.fn();

    renderHook(() => useMediaEvent('media:view', handler), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    sdk.trackView(mockAsset);

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].asset.id).toBe('101');
  });

  it('unsubscribes automatically when component unmounts', () => {
    const sdk = new MediaSDK({ apiKey: 'test-key', enableDefaultLogger: false });
    const handler = vi.fn();

    const { unmount } = renderHook(() => useMediaEvent('media:download', handler), {
      wrapper: ({ children }) => <MediaSDKProvider sdk={sdk}>{children}</MediaSDKProvider>,
    });

    sdk.trackDownload(mockAsset);
    expect(handler).toHaveBeenCalledTimes(1);

    unmount();

    sdk.trackDownload(mockAsset);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
