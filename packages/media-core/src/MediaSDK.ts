import type { MediaAsset, MediaSearchParams, MediaSearchResult } from './types/media.js';
import type { MediaSDKConfig } from './types/config.js';
import type { MediaEventMap } from './types/events.js';
import type { MediaProvider } from './providers/provider.interface.js';
import { PexelsProvider } from './providers/pexels.provider.js';
import { ValidationError } from './errors/index.js';
import { EventEmitter } from './events/EventEmitter.js';
import { MediaCache } from './cache/MediaCache.js';

export class MediaSDK {
  private provider: MediaProvider;
  private cache: MediaCache;
  private emitter = new EventEmitter<MediaEventMap>();

  constructor(config: MediaSDKConfig) {
    if (!config) {
      throw new ValidationError('MediaSDK configuration must be provided');
    }
    if (!config.apiKey && !config.provider) {
      throw new ValidationError('API key is required when initializing MediaSDK');
    }

    if (config.provider) {
      this.provider = config.provider;
    } else {
      this.provider = new PexelsProvider({
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        fetch: config.fetch,
      });
    }

    this.cache = new MediaCache(config.cache);

    // Default Event Listener setup
    const enableDefaultLogger = config.enableDefaultLogger ?? true;
    const logFn = config.logger || ((event: string, payload: any) => {
      console.log(`[MediaSDK Event] ${event}:`, payload);
    });

    if (enableDefaultLogger) {
      this.on('media:view', (payload) => logFn('media:view', payload));
      this.on('media:download', (payload) => logFn('media:download', payload));
    }
  }

  public get providerName(): string {
    return this.provider.name;
  }

  public async search(params: MediaSearchParams): Promise<MediaSearchResult> {
    const key = this.cache.generateKey(`search:${this.provider.name}`, params as Record<string, any>);
    return this.cache.fetchWithDeduplication(key, () => this.provider.search(params));
  }

  public async curated(params?: Omit<MediaSearchParams, 'query'>): Promise<MediaSearchResult> {
    const key = this.cache.generateKey(`curated:${this.provider.name}`, (params || {}) as Record<string, any>);
    return this.cache.fetchWithDeduplication(key, () => this.provider.curated(params));
  }

  public async getById(id: string | number): Promise<MediaAsset> {
    const key = this.cache.generateKey(`getById:${this.provider.name}`, { id });
    return this.cache.fetchWithDeduplication(key, () => this.provider.getById(id));
  }

  public trackView(asset: MediaAsset): void {
    if (!asset || !asset.id) {
      throw new ValidationError('Valid MediaAsset required for tracking view');
    }
    this.emitter.emit('media:view', {
      asset,
      timestamp: Date.now(),
    });
  }

  public trackDownload(asset: MediaAsset): void {
    if (!asset || !asset.id) {
      throw new ValidationError('Valid MediaAsset required for tracking download');
    }
    this.emitter.emit('media:download', {
      asset,
      timestamp: Date.now(),
    });
  }

  public on<E extends keyof MediaEventMap>(
    event: E,
    handler: (payload: MediaEventMap[E]) => void
  ): () => void {
    return this.emitter.on(event, handler);
  }

  public off<E extends keyof MediaEventMap>(
    event: E,
    handler: (payload: MediaEventMap[E]) => void
  ): void {
    this.emitter.off(event, handler);
  }

  public clearCache(): void {
    this.cache.clear();
  }
}
