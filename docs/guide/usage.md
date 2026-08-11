# Usage

## Core TypeScript SDK Usage

Initialize `MediaSDK` with your API key:

```typescript
import { MediaSDK } from '@fotowl/media-core';

const sdk = new MediaSDK({
  apiKey: 'YOUR_PEXELS_API_KEY',
  cache: {
    ttlMs: 5 * 60 * 1000,
    enabled: true,
  },
});

// Search photos
const searchResult = await sdk.search({ query: 'nature', page: 1, perPage: 10 });

// Fetch curated photos
const curatedResult = await sdk.curated({ page: 1, perPage: 10 });

// Fetch photo by ID
const asset = await sdk.getById('12345');
```

## React Hooks Usage

Wrap your React app with `MediaSDKProvider`:

```tsx
import React from 'react';
import { MediaSDKProvider, useMediaSearch } from '@fotowl/media-react';

export function App() {
  return (
    <MediaSDKProvider config={{ apiKey: 'YOUR_PEXELS_API_KEY' }}>
      <MediaGallery />
    </MediaSDKProvider>
  );
}

function MediaGallery() {
  const { data, isLoading, error } = useMediaSearch({ query: 'nature', page: 1 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.assets.map((asset) => (
        <img key={asset.id} src={asset.previewUrl} alt={asset.title} />
      ))}
    </div>
  );
}
```
