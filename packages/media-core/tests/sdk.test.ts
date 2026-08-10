import { describe, expect, it, vi } from 'vitest';
import { MediaAsset, MediaProvider, MediaSDK } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '777',
  type: 'photo',
  title: 'Facade Test Asset',
  url: 'https://example.com/asset/777',
  previewUrl: 'https://example.com/asset/777/preview.jpg',
  downloadUrl: 'https://example.com/asset/777/original.jpg',
  width: 1000,
  height: 800,
  author: { name: 'Test Author' },
  src: {
    original: 'https://example.com/asset/777/original.jpg',
    large: 'https://example.com/asset/777/large.jpg',
    medium: 'https://example.com/asset/777/medium.jpg',
    small: 'https://example.com/asset/777/small.jpg',
    tiny: 'https://example.com/asset/777/tiny.jpg',
  },
};

describe('MediaSDK Public Facade', () => {
  const createMockProvider = (): MediaProvider => ({
    name: 'mock-provider',
    search: vi.fn().mockResolvedValue({
      assets: [mockAsset],
      pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
    }),
    curated: vi.fn().mockResolvedValue({
      assets: [mockAsset],
      pagination: { page: 1, perPage: 10, totalResults: 1, hasNext: false },
    }),
    getById: vi.fn().mockResolvedValue(mockAsset),
  });

  it('delegates search() to provider and caches the result', async () => {
    const provider = createMockProvider();
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      provider,
      enableDefaultLogger: false,
    });

    const res1 = await sdk.search({ query: 'ocean', page: 1 });
    const res2 = await sdk.search({ query: 'ocean', page: 1 });

    expect(provider.search).toHaveBeenCalledOnce();
    expect(res1).toEqual(res2);
    expect(res1.assets[0].id).toBe('777');
  });

  it('delegates curated() to provider and caches the result', async () => {
    const provider = createMockProvider();
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      provider,
      enableDefaultLogger: false,
    });

    const res1 = await sdk.curated({ page: 1 });
    const res2 = await sdk.curated({ page: 1 });

    expect(provider.curated).toHaveBeenCalledOnce();
    expect(res1).toEqual(res2);
  });

  it('delegates getById() to provider and caches the result', async () => {
    const provider = createMockProvider();
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      provider,
      enableDefaultLogger: false,
    });

    const asset1 = await sdk.getById('777');
    const asset2 = await sdk.getById('777');

    expect(provider.getById).toHaveBeenCalledOnce();
    expect(asset1).toEqual(asset2);
  });

  it('invalidates cache when clearCache() is invoked', async () => {
    const provider = createMockProvider();
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      provider,
      enableDefaultLogger: false,
    });

    await sdk.search({ query: 'sun' });
    expect(provider.search).toHaveBeenCalledTimes(1);

    sdk.clearCache();

    await sdk.search({ query: 'sun' });
    expect(provider.search).toHaveBeenCalledTimes(2);
  });

  it('emits media:view when trackView() is called', () => {
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      enableDefaultLogger: false,
    });
    const listener = vi.fn();

    sdk.on('media:view', listener);
    sdk.trackView(mockAsset);

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].asset.id).toBe('777');
  });

  it('emits media:download when trackDownload() is called', () => {
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      enableDefaultLogger: false,
    });
    const listener = vi.fn();

    sdk.on('media:download', listener);
    sdk.trackDownload(mockAsset);

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].asset.id).toBe('777');
  });

  it('unsubscribes listener via return function of on()', () => {
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      enableDefaultLogger: false,
    });
    const listener = vi.fn();

    const unsubscribe = sdk.on('media:view', listener);
    sdk.trackView(mockAsset);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    sdk.trackView(mockAsset);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes listener via off()', () => {
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      enableDefaultLogger: false,
    });
    const listener = vi.fn();

    sdk.on('media:download', listener);
    sdk.trackDownload(mockAsset);
    expect(listener).toHaveBeenCalledTimes(1);

    sdk.off('media:download', listener);
    sdk.trackDownload(mockAsset);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('triggers default logger for view and download events when enabled', () => {
    const logger = vi.fn();
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      enableDefaultLogger: true,
      logger,
    });

    sdk.trackView(mockAsset);
    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger.mock.calls[0][0]).toBe('media:view');

    sdk.trackDownload(mockAsset);
    expect(logger).toHaveBeenCalledTimes(2);
    expect(logger.mock.calls[1][0]).toBe('media:download');
  });

  it('disables default logger when enableDefaultLogger is false', () => {
    const logger = vi.fn();
    const sdk = new MediaSDK({
      apiKey: 'test-key',
      enableDefaultLogger: false,
      logger,
    });

    sdk.trackView(mockAsset);
    sdk.trackDownload(mockAsset);
    expect(logger).not.toHaveBeenCalled();
  });
});
