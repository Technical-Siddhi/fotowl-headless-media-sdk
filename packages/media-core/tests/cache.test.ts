import { describe, expect, it, vi } from 'vitest';
import { MediaCache, MediaSDK } from '../src/index.js';

describe('MediaCache & Request Deduplication', () => {
  it('generates distinct deterministic cache keys for different parameter orderings and values', () => {
    const cache = new MediaCache();

    const key1 = cache.generateKey('search:pexels', { query: 'nature', page: 1, perPage: 10 });
    const key2 = cache.generateKey('search:pexels', { perPage: 10, page: 1, query: 'nature' });
    const key3 = cache.generateKey('search:pexels', { query: 'nature', page: 2, perPage: 10 });

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
  });

  it('caches identical search requests and returns cached results', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        total_results: 10,
        page: 1,
        per_page: 5,
        photos: [],
      }),
    });

    const sdk = new MediaSDK({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    const res1 = await sdk.search({ query: 'cats', page: 1 });
    const res2 = await sdk.search({ query: 'cats', page: 1 });

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(res1).toEqual(res2);
  });

  it('deduplicates concurrent in-flight requests', async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    const mockFetch = vi.fn().mockImplementation(() =>
      fetchPromise.then(() => ({
        ok: true,
        status: 200,
        json: async () => ({
          total_results: 5,
          page: 1,
          per_page: 5,
          photos: [],
        }),
      }))
    );

    const sdk = new MediaSDK({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    const req1 = sdk.search({ query: 'dogs' });
    const req2 = sdk.search({ query: 'dogs' });

    expect(mockFetch).toHaveBeenCalledOnce();

    resolveFetch!({});
    const [res1, res2] = await Promise.all([req1, req2]);

    expect(res1).toEqual(res2);
  });

  it('removes in-flight entry even if the request rejects', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network crash'));

    const sdk = new MediaSDK({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    const req1 = sdk.search({ query: 'fail-test' });
    await expect(req1).rejects.toThrow();

    // Second request after failure should attempt a new fetch call
    const req2 = sdk.search({ query: 'fail-test' });
    await expect(req2).rejects.toThrow();

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('clears cache when clearCache() is called', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        total_results: 1,
        page: 1,
        per_page: 5,
        photos: [],
      }),
    });

    const sdk = new MediaSDK({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    await sdk.search({ query: 'birds' });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    sdk.clearCache();

    await sdk.search({ query: 'birds' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
