import type { MediaAsset, MediaSearchParams, MediaSearchResult } from '../types/media.js';

export interface MediaProviderOptions {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface MediaProvider {
  readonly name: string;
  search(params: MediaSearchParams): Promise<MediaSearchResult>;
  curated(params?: Omit<MediaSearchParams, 'query'>): Promise<MediaSearchResult>;
  getById(id: string | number): Promise<MediaAsset>;
}
