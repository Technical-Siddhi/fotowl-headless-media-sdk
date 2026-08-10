import type React from 'react';
import type { MediaSDK, MediaSDKConfig, MediaSDKError } from '@fotowl/media-core';

export interface MediaSDKProviderProps {
  config?: MediaSDKConfig;
  sdk?: MediaSDK;
  children: React.ReactNode;
}

export interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: MediaSDKError | Error | null;
  refetch: () => Promise<void>;
}

export interface QueryHookOptions {
  enabled?: boolean;
}
