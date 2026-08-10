import React, { useRef } from 'react';
import { MediaSDK, type MediaSDKConfig } from '@fotowl/media-core';
import { MediaSDKContext } from './MediaSDKContext.js';
import type { MediaSDKProviderProps } from '../types/index.js';

function isConfigEqual(a?: MediaSDKConfig, b?: MediaSDKConfig): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  return (
    a.apiKey === b.apiKey &&
    a.baseUrl === b.baseUrl &&
    a.provider === b.provider &&
    a.fetch === b.fetch &&
    a.enableDefaultLogger === b.enableDefaultLogger &&
    a.logger === b.logger &&
    a.cache?.ttlMs === b.cache?.ttlMs &&
    a.cache?.enabled === b.cache?.enabled
  );
}

export const MediaSDKProvider: React.FC<MediaSDKProviderProps> = ({ config, sdk, children }) => {
  const sdkInstanceRef = useRef<MediaSDK | null>(null);
  const prevConfigRef = useRef<MediaSDKConfig | undefined>(undefined);

  let activeSdk: MediaSDK | null = null;

  if (sdk) {
    activeSdk = sdk;
  } else if (config) {
    if (!sdkInstanceRef.current || !isConfigEqual(prevConfigRef.current, config)) {
      sdkInstanceRef.current = new MediaSDK(config);
      prevConfigRef.current = config;
    }
    activeSdk = sdkInstanceRef.current;
  }

  return (
    <MediaSDKContext.Provider value={activeSdk}>
      {children}
    </MediaSDKContext.Provider>
  );
};
