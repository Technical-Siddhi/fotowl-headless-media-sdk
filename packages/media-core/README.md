# `@fotowl/media-core`

Framework-agnostic core Media SDK providing a unified data layer, API provider abstraction, event tracking, and in-memory caching for media resources.

---

## 🎯 Architectural Principle

`@fotowl/media-core` is strictly **framework-agnostic** and written in pure TypeScript. It has **zero dependencies** on React, React Native, DOM APIs, or UI frameworks. It can be consumed in any JavaScript/TypeScript runtime (Node.js, Browser, React, React Native, Vue, Svelte, etc.).

---

## 🚀 Workspace Usage

In a pnpm workspace package:

```json
{
  "dependencies": {
    "@fotowl/media-core": "workspace:*"
  }
}
```

---

## ⚙️ Configuration

Initialize `MediaSDK` with your API key or a custom provider instance:

```typescript
import { MediaSDK } from '@fotowl/media-core';

const sdk = new MediaSDK({
  apiKey: 'YOUR_PEXELS_API_KEY',
  cache: {
    ttlMs: 5 * 60 * 1000, // 5 minutes (default)
    enabled: true,
  },
  enableDefaultLogger: true, // Default: true (logs view & download events)
  logger: (event, payload) => console.log(`[SDK Log] ${event}`, payload), // Custom logger override
});
```

---

## 📖 Public API Methods

### `sdk.search(params: MediaSearchParams): Promise<MediaSearchResult>`
Searches media items using specified query criteria and returns normalized assets.

```typescript
const result = await sdk.search({
  query: 'mountains',
  page: 1,
  perPage: 15,
  orientation: 'landscape',
});

console.log(result.assets); // Array of normalized MediaAsset items
console.log(result.pagination); // PaginationMeta ({ page, perPage, totalResults, hasNext })
```

### `sdk.curated(params?: Omit<MediaSearchParams, 'query'>): Promise<MediaSearchResult>`
Fetches curated/trending media items.

```typescript
const curatedResult = await sdk.curated({ page: 1, perPage: 10 });
```

### `sdk.getById(id: string | number): Promise<MediaAsset>`
Fetches a single normalized media asset by ID via the Pexels `/photos/:id` endpoint.

```typescript
const asset = await sdk.getById('12345');
```

### `sdk.clearCache(): void`
Clears all in-memory cached responses and in-flight request entries.

---

## 📡 Event Tracking & Subscription

`MediaSDK` features a framework-agnostic event pub/sub system for monitoring media usage.

- **Default Event Listener:** By default (`enableDefaultLogger: true`), `MediaSDK` attaches a console log listener to `'media:view'` and `'media:download'` events. You can customize the log function by providing a `logger` callback in `MediaSDKConfig` or disable it with `enableDefaultLogger: false`.

```typescript
// Subscribe to view events
const unsubscribeView = sdk.on('media:view', (event) => {
  console.log('Media Viewed:', event.asset.id, event.timestamp);
});

// Subscribe to download events
const unsubscribeDownload = sdk.on('media:download', (event) => {
  console.log('Media Downloaded:', event.asset.id, event.timestamp);
});

// Trigger tracking events
sdk.trackView(asset);
sdk.trackDownload(asset);

// Unsubscribe when finished
unsubscribeView();
unsubscribeDownload();
```

---

## ⚠️ Error Handling

All errors thrown by the SDK inherit from `MediaSDKError`:

- `AuthenticationError`: Invalid or missing API key (401/403).
- `ValidationError`: Invalid input params or missing configuration (400).
- `RateLimitError`: API rate limits exceeded (429).
- `NetworkError`: Fetch / connection failure.
- `ProviderError`: Upstream API server failure (5xx).

```typescript
import { MediaSDK, AuthenticationError, RateLimitError } from '@fotowl/media-core';

try {
  const result = await sdk.search({ query: 'nature' });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Check API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit reached');
  }
}
```
