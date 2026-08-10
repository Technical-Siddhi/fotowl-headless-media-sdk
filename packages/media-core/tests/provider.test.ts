import { describe, expect, it, vi } from 'vitest';
import {
  AuthenticationError,
  NetworkError,
  PexelsProvider,
  ProviderError,
  RateLimitError,
  ValidationError,
} from '../src/index.js';

const mockPexelsPhoto = {
  id: 12345,
  width: 1920,
  height: 1080,
  url: 'https://www.pexels.com/photo/12345/',
  photographer: 'John Doe',
  photographer_url: 'https://www.pexels.com/@johndoe',
  photographer_id: 6789,
  avg_color: '#336699',
  src: {
    original: 'https://images.pexels.com/photos/12345/original.jpg',
    large2x: 'https://images.pexels.com/photos/12345/large2x.jpg',
    large: 'https://images.pexels.com/photos/12345/large.jpg',
    medium: 'https://images.pexels.com/photos/12345/medium.jpg',
    small: 'https://images.pexels.com/photos/12345/small.jpg',
    portrait: 'https://images.pexels.com/photos/12345/portrait.jpg',
    landscape: 'https://images.pexels.com/photos/12345/landscape.jpg',
    tiny: 'https://images.pexels.com/photos/12345/tiny.jpg',
  },
  liked: false,
  alt: 'Beautiful landscape view',
};

const mockSearchResponse = {
  total_results: 100,
  page: 1,
  per_page: 15,
  photos: [mockPexelsPhoto],
  next_page: 'https://api.pexels.com/v1/search?page=2&per_page=15&query=nature',
};

describe('PexelsProvider & Data Normalization', () => {
  it('searches media and normalizes Pexels response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockSearchResponse,
    });

    const provider = new PexelsProvider({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    const result = await provider.search({
      query: 'nature',
      page: 1,
      perPage: 15,
      orientation: 'landscape',
    });

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl = new URL(mockFetch.mock.calls[0][0]);
    expect(calledUrl.pathname).toBe('/v1/search');
    expect(calledUrl.searchParams.get('query')).toBe('nature');
    expect(calledUrl.searchParams.get('orientation')).toBe('landscape');

    expect(result.assets).toHaveLength(1);
    const asset = result.assets[0];
    expect(asset.id).toBe('12345');
    expect(asset.type).toBe('photo');
    expect(asset.title).toBe('Beautiful landscape view');
    expect(asset.url).toBe(mockPexelsPhoto.url);
    expect(asset.previewUrl).toBe(mockPexelsPhoto.src.medium);
    expect(asset.downloadUrl).toBe(mockPexelsPhoto.src.original);
    expect(asset.width).toBe(1920);
    expect(asset.height).toBe(1080);
    expect(asset.author.name).toBe('John Doe');
    expect(asset.author.url).toBe('https://www.pexels.com/@johndoe');
    expect(asset.avgColor).toBe('#336699');
    expect(asset.metadata?.provider).toBe('pexels');

    expect(result.pagination.totalResults).toBe(100);
    expect(result.pagination.hasNext).toBe(true);
    expect(result.pagination.nextPage).toBe(2);
  });

  it('fetches curated media correctly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockSearchResponse,
    });

    const provider = new PexelsProvider({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    const result = await provider.curated({ page: 2, perPage: 10 });
    const calledUrl = new URL(mockFetch.mock.calls[0][0]);
    expect(calledUrl.pathname).toBe('/v1/curated');
    expect(calledUrl.searchParams.get('page')).toBe('2');
    expect(calledUrl.searchParams.get('per_page')).toBe('10');
    expect(result.assets).toHaveLength(1);
  });

  it('fetches a single photo by ID via /photos/:id', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockPexelsPhoto,
    });

    const provider = new PexelsProvider({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    const asset = await provider.getById(12345);
    const calledUrl = new URL(mockFetch.mock.calls[0][0]);
    expect(calledUrl.pathname).toBe('/v1/photos/12345');
    expect(asset.id).toBe('12345');
  });

  it('maps 401 response to AuthenticationError', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'Invalid API key',
    });

    const provider = new PexelsProvider({
      apiKey: 'invalid-key',
      fetch: mockFetch as any,
    });

    await expect(provider.search({ query: 'test' })).rejects.toThrow(AuthenticationError);
  });

  it('maps 429 response to RateLimitError', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      text: async () => 'Rate limit exceeded',
    });

    const provider = new PexelsProvider({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    await expect(provider.search({ query: 'test' })).rejects.toThrow(RateLimitError);
  });

  it('maps 400 response to ValidationError', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => 'Invalid query',
    });

    const provider = new PexelsProvider({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    await expect(provider.search({ query: 'test' })).rejects.toThrow(ValidationError);
  });

  it('maps 500 response to ProviderError', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Server crash',
    });

    const provider = new PexelsProvider({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    await expect(provider.search({ query: 'test' })).rejects.toThrow(ProviderError);
  });

  it('maps fetch network errors to NetworkError', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    const provider = new PexelsProvider({
      apiKey: 'test-key',
      fetch: mockFetch as any,
    });

    await expect(provider.search({ query: 'test' })).rejects.toThrow(NetworkError);
  });
});
