import type { MediaProvider } from '../providers/provider.interface.js';

export interface CacheConfig {
  ttlMs?: number;
  enabled?: boolean;
}

export interface MediaSDKConfig {
  apiKey: string;
  baseUrl?: string;
  provider?: MediaProvider;
  cache?: CacheConfig;
  fetch?: typeof fetch;
  enableDefaultLogger?: boolean;
  logger?: (event: string, payload: any) => void;
}
