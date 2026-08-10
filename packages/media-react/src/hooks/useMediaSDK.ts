import { useContext } from 'react';
import type { MediaSDK } from '@fotowl/media-core';
import { MediaSDKContext } from '../context/MediaSDKContext.js';

export function useMediaSDK(): MediaSDK {
  const sdk = useContext(MediaSDKContext);
  if (!sdk) {
    throw new Error('useMediaSDK must be used within a <MediaSDKProvider>');
  }
  return sdk;
}
