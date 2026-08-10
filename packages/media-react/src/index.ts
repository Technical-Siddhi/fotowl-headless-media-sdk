// Provider
export { MediaSDKProvider } from './context/MediaSDKProvider.js';

// Hooks
export { useMediaSDK } from './hooks/useMediaSDK.js';
export { useMediaSearch } from './hooks/useMediaSearch.js';
export { useCuratedMedia } from './hooks/useCuratedMedia.js';
export { useMediaItem } from './hooks/useMediaItem.js';
export { useMediaEvent } from './hooks/useMediaEvent.js';

// React Public Types
export type {
  MediaSDKProviderProps,
  UseQueryResult,
  QueryHookOptions,
} from './types/index.js';

// Re-export core types for consumer convenience
export type {
  MediaAsset,
  MediaSearchParams,
  MediaSearchResult,
  PaginationMeta,
  MediaSDKConfig,
  CacheConfig,
  MediaEventMap,
} from '@fotowl/media-core';

export {
  MediaSDK,
  MediaSDKError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  NetworkError,
  ProviderError,
} from '@fotowl/media-core';
