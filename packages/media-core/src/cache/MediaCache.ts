export interface CacheOptions {
  ttlMs?: number;
  enabled?: boolean;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class MediaCache {
  private cache = new Map<string, CacheEntry<any>>();
  private inFlight = new Map<string, Promise<any>>();
  private ttlMs: number;
  private enabled: boolean;

  constructor(options?: CacheOptions) {
    this.ttlMs = options?.ttlMs ?? 5 * 60 * 1000; // Default: 5 minutes
    this.enabled = options?.enabled ?? true;
  }

  public generateKey(prefix: string, params: Record<string, any>): string {
    const normalize = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(normalize);
      return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
          if (obj[key] !== undefined) {
            acc[key] = normalize(obj[key]);
          }
          return acc;
        }, {} as Record<string, any>);
    };

    return `${prefix}:${JSON.stringify(normalize(params))}`;
  }

  public get<T>(key: string): T | undefined {
    if (!this.enabled) return undefined;
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T, customTtlMs?: number): void {
    if (!this.enabled) return;
    const ttl = customTtlMs ?? this.ttlMs;
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  public async fetchWithDeduplication<T>(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    if (!this.enabled) {
      return fetchFn();
    }

    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key) as Promise<T>;
    }

    const promise = (async () => {
      try {
        const result = await fetchFn();
        this.set(key, result);
        return result;
      } finally {
        // Requirement 9: Remove in-flight entry on resolve OR reject
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  public clear(): void {
    this.cache.clear();
    this.inFlight.clear();
  }

  public delete(key: string): void {
    this.cache.delete(key);
    this.inFlight.delete(key);
  }
}
