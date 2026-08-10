import { describe, expect, it, vi } from 'vitest';
import { MediaAsset, MediaSDK, ValidationError } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '101',
  type: 'photo',
  title: 'Test Photo',
  url: 'https://example.com/photo/101',
  previewUrl: 'https://example.com/photo/101/preview.jpg',
  downloadUrl: 'https://example.com/photo/101/download.jpg',
  width: 800,
  height: 600,
  author: { name: 'Alice' },
  src: {
    original: 'https://example.com/photo/101/original.jpg',
    large: 'https://example.com/photo/101/large.jpg',
    medium: 'https://example.com/photo/101/medium.jpg',
    small: 'https://example.com/photo/101/small.jpg',
    tiny: 'https://example.com/photo/101/tiny.jpg',
  },
};

describe('MediaSDK Event System', () => {
  it('subscribes to media:view and receives payload when trackView is called', () => {
    const sdk = new MediaSDK({ apiKey: 'test-key', enableDefaultLogger: false });
    const viewListener = vi.fn();

    sdk.on('media:view', viewListener);
    sdk.trackView(mockAsset);

    expect(viewListener).toHaveBeenCalledOnce();
    const payload = viewListener.mock.calls[0][0];
    expect(payload.asset.id).toBe('101');
    expect(payload.timestamp).toBeGreaterThan(0);
  });

  it('subscribes to media:download and receives payload when trackDownload is called', () => {
    const sdk = new MediaSDK({ apiKey: 'test-key', enableDefaultLogger: false });
    const downloadListener = vi.fn();

    sdk.on('media:download', downloadListener);
    sdk.trackDownload(mockAsset);

    expect(downloadListener).toHaveBeenCalledOnce();
    const payload = downloadListener.mock.calls[0][0];
    expect(payload.asset.id).toBe('101');
  });

  it('unsubscribes using the returned cleanup function', () => {
    const sdk = new MediaSDK({ apiKey: 'test-key', enableDefaultLogger: false });
    const listener = vi.fn();

    const unsubscribe = sdk.on('media:view', listener);
    sdk.trackView(mockAsset);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    sdk.trackView(mockAsset);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes using off()', () => {
    const sdk = new MediaSDK({ apiKey: 'test-key', enableDefaultLogger: false });
    const listener = vi.fn();

    sdk.on('media:download', listener);
    sdk.trackDownload(mockAsset);
    expect(listener).toHaveBeenCalledTimes(1);

    sdk.off('media:download', listener);
    sdk.trackDownload(mockAsset);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('throws ValidationError if tracking invalid asset', () => {
    const sdk = new MediaSDK({ apiKey: 'test-key', enableDefaultLogger: false });
    expect(() => sdk.trackView(null as any)).toThrow(ValidationError);
    expect(() => sdk.trackDownload({} as any)).toThrow(ValidationError);
  });
});
