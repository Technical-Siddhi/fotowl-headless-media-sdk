import { createContext } from 'react';
import type { MediaSDK } from '@fotowl/media-core';

export const MediaSDKContext = createContext<MediaSDK | null>(null);
