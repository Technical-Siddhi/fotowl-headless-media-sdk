# `@fotowl/media-react`

Thin React adapter for `@fotowl/media-core`, providing idiomatic React context providers and hooks for fetching, searching, and tracking media resources in React applications.

---

## 🏗️ Architecture & Dependency Direction

```
React Application
       ↓
@fotowl/media-react  (React Context & Hooks adapter)
       ↓
@fotowl/media-core   (Framework-agnostic logic, caching, event emitter)
       ↓
MediaProvider / PexelsProvider
```

`@fotowl/media-react` contains **zero direct network requests** or provider logic. All caching, deduplication, Pexels integration, normalization, and event emission are handled transparently by `@fotowl/media-core`.

---

## 🚀 Installation & Workspace Usage

In a pnpm workspace:

```json
{
  "dependencies": {
    "@fotowl/media-core": "workspace:*",
    "@fotowl/media-react": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

---

## ⚡ Quick Start

### 1. Wrap your app with `MediaSDKProvider`

```tsx
import React from 'react';
import { MediaSDKProvider } from '@fotowl/media-react';

export function App() {
  return (
    <MediaSDKProvider config={{ apiKey: 'YOUR_PEXELS_API_KEY' }}>
      <MediaGallery />
    </MediaSDKProvider>
  );
}
```

> **Note on Provider Config Stability:**
> `MediaSDKProvider` compares key configuration properties (`apiKey`, `baseUrl`, etc.) across parent renders. Inline object literals like `config={{ apiKey: 'xyz' }}` will **not** recreate the `MediaSDK` instance unnecessarily. If an explicit `sdk` prop is passed, that exact instance is used directly.

---

## 🪝 Hooks API

### `useMediaSDK()`
Accesses the `MediaSDK` instance from context. Throws an error if used outside `<MediaSDKProvider>`.

```tsx
const sdk = useMediaSDK();
```

---

### `useMediaSearch(params, options?)`
Searches media items using `sdk.search()`. Preserves loading, data, error, and `refetch` capabilities with stale request protection.

```tsx
import { useMediaSearch } from '@fotowl/media-react';

function SearchComponent({ query }: { query: string }) {
  const { data, isLoading, error, refetch } = useMediaSearch({
    query,
    page: 1,
    perPage: 15,
  });

  if (isLoading) return <div>Loading media...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <div className="grid">
        {data?.assets.map((asset) => (
          <img key={asset.id} src={asset.previewUrl} alt={asset.title} />
        ))}
      </div>
    </div>
  );
}
```

---

### `useCuratedMedia(params?, options?)`
Fetches curated/trending media items via `sdk.curated()`.

```tsx
import { useCuratedMedia } from '@fotowl/media-react';

function CuratedGallery() {
  const { data, isLoading, error } = useCuratedMedia({ page: 1, perPage: 10 });
  // ...
}
```

---

### `useMediaItem(id, options?)`
Fetches a single normalized media asset by ID via `sdk.getById()`. Safe against changing IDs and stale promises.

```tsx
import { useMediaItem } from '@fotowl/media-react';

function MediaDetail({ id }: { id: string }) {
  const { data: asset, isLoading, error } = useMediaItem(id);
  // ...
}
```

---

### `useMediaEvent(event, handler)`
Subscribes to core SDK events (`'media:view'`, `'media:download'`) with automatic unsubscription on component unmount or dependency change.

```tsx
import { useMediaEvent } from '@fotowl/media-react';

function EventLogger() {
  useMediaEvent('media:view', (event) => {
    console.log('Viewed asset:', event.asset.id);
  });

  useMediaEvent('media:download', (event) => {
    console.log('Downloaded asset:', event.asset.id);
  });

  return null;
}
```

---

## ⚠️ Error Handling

Errors exposed in `error` retain their original typed `MediaSDKError` hierarchy from `@fotowl/media-core`:

- `AuthenticationError` (401/403)
- `ValidationError` (400/422)
- `RateLimitError` (429)
- `NetworkError`
- `ProviderError` (500)

```tsx
if (error instanceof AuthenticationError) {
  // Handle invalid API key
}
```
