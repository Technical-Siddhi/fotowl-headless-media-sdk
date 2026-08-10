import type { MediaAsset } from './media.js';

export interface MediaViewEventPayload {
  asset: MediaAsset;
  timestamp: number;
}

export interface MediaDownloadEventPayload {
  asset: MediaAsset;
  timestamp: number;
}

export interface MediaEventMap {
  'media:view': MediaViewEventPayload;
  'media:download': MediaDownloadEventPayload;
}
