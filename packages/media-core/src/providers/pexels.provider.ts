import type { MediaAsset, MediaSearchParams, MediaSearchResult } from '../types/media.js';
import type { MediaProvider, MediaProviderOptions } from './provider.interface.js';
import type { PexelsCuratedResponse, PexelsPhoto, PexelsSearchResponse } from './pexels.types.js';
import {
  AuthenticationError,
  NetworkError,
  ProviderError,
  RateLimitError,
  ValidationError,
} from '../errors/index.js';

export function normalizePexelsPhoto(photo: PexelsPhoto): MediaAsset {
  return {
    id: String(photo.id),
    type: 'photo',
    title: photo.alt && photo.alt.trim().length > 0 ? photo.alt : `Pexels Photo ${photo.id}`,
    url: photo.url,
    previewUrl: photo.src.medium || photo.src.small || photo.src.tiny,
    downloadUrl: photo.src.original,
    width: photo.width,
    height: photo.height,
    author: {
      name: photo.photographer,
      url: photo.photographer_url,
    },
    src: {
      original: photo.src.original,
      large: photo.src.large2x || photo.src.large,
      medium: photo.src.medium,
      small: photo.src.small,
      portrait: photo.src.portrait,
      landscape: photo.src.landscape,
      tiny: photo.src.tiny,
    },
    avgColor: photo.avg_color,
    metadata: {
      photographerId: photo.photographer_id,
      liked: photo.liked,
      provider: 'pexels',
    },
  };
}

export class PexelsProvider implements MediaProvider {
  public readonly name = 'pexels';
  private apiKey: string;
  private baseUrl: string;
  private fetchImpl: typeof fetch;

  constructor(options: MediaProviderOptions) {
    if (!options.apiKey || options.apiKey.trim().length === 0) {
      throw new ValidationError('Pexels API key is required');
    }
    this.apiKey = options.apiKey.trim();
    this.baseUrl = options.baseUrl?.replace(/\/+$/, '') || 'https://api.pexels.com/v1';
    this.fetchImpl = options.fetch || (globalThis.fetch ? globalThis.fetch.bind(globalThis) : fetch);
  }

  private async request<T>(endpoint: string, searchParams?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    let response: Response;
    try {
      response = await this.fetchImpl(url.toString(), {
        headers: {
          Authorization: this.apiKey,
          Accept: 'application/json',
        },
      });
    } catch (err: any) {
      throw new NetworkError(`Failed to fetch from Pexels API: ${err?.message || String(err)}`, err);
    }

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        // ignore body parse failure
      }

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError('Pexels API authentication failed. Check your API key.', response.status, errorBody);
      }
      if (response.status === 429) {
        throw new RateLimitError('Pexels API rate limit exceeded.', response.status, errorBody);
      }
      if (response.status === 400 || response.status === 422) {
        throw new ValidationError(`Invalid request parameters for Pexels API: ${errorBody || response.statusText}`);
      }
      throw new ProviderError(`Pexels API error (${response.status}): ${errorBody || response.statusText}`, response.status, this.name, errorBody);
    }

    try {
      return (await response.json()) as T;
    } catch (err: any) {
      throw new ProviderError('Failed to parse JSON response from Pexels API', response.status, this.name, err);
    }
  }

  public async search(params: MediaSearchParams): Promise<MediaSearchResult> {
    if (!params.query || params.query.trim().length === 0) {
      throw new ValidationError('Search query cannot be empty');
    }

    const queryParams = {
      query: params.query.trim(),
      page: params.page,
      per_page: params.perPage,
      orientation: params.orientation,
      size: params.size,
      color: params.color,
      locale: params.locale,
    };

    const data = await this.request<PexelsSearchResponse>('/search', queryParams);
    const photos = data.photos || [];

    const assets = photos.map(normalizePexelsPhoto);
    const totalResults = data.total_results || 0;
    const page = data.page || params.page || 1;
    const perPage = data.per_page || params.perPage || 15;
    const hasNext = Boolean(data.next_page) || (page * perPage < totalResults);

    return {
      assets,
      pagination: {
        page,
        perPage,
        totalResults,
        nextPage: hasNext ? page + 1 : undefined,
        prevPage: page > 1 ? page - 1 : undefined,
        hasNext,
      },
    };
  }

  public async curated(params?: Omit<MediaSearchParams, 'query'>): Promise<MediaSearchResult> {
    const queryParams = {
      page: params?.page,
      per_page: params?.perPage,
    };

    const data = await this.request<PexelsCuratedResponse>('/curated', queryParams);
    const photos = data.photos || [];

    const assets = photos.map(normalizePexelsPhoto);
    const page = data.page || params?.page || 1;
    const perPage = data.per_page || params?.perPage || 15;
    const totalResults = data.total_results;
    const hasNext = Boolean(data.next_page) || (totalResults !== undefined && page * perPage < totalResults);

    return {
      assets,
      pagination: {
        page,
        perPage,
        totalResults,
        nextPage: hasNext ? page + 1 : undefined,
        prevPage: page > 1 ? page - 1 : undefined,
        hasNext,
      },
    };
  }

  public async getById(id: string | number): Promise<MediaAsset> {
    if (id === undefined || id === null || String(id).trim().length === 0) {
      throw new ValidationError('Media ID must be provided');
    }

    const photo = await this.request<PexelsPhoto>(`/photos/${id}`);
    return normalizePexelsPhoto(photo);
  }
}
