# Event Telemetry

`MediaSDK` features an internal pub/sub event system for tracking asset activity (`media:view` and `media:download`).

## Subscribing in Core TypeScript

```typescript
import { MediaSDK } from '@fotowl/media-core';

const sdk = new MediaSDK({ apiKey: 'YOUR_API_KEY' });

// Subscribe to view events
const unsubscribeView = sdk.on('media:view', (event) => {
  console.log('Asset viewed:', event.asset.id, event.timestamp);
});

// Subscribe to download events
const unsubscribeDownload = sdk.on('media:download', (event) => {
  console.log('Asset downloaded:', event.asset.id, event.timestamp);
});

// Trigger events manually
sdk.trackView(asset);
sdk.trackDownload(asset);
```

## Subscribing in React Components

Use the `useMediaEvent` hook from `@fotowl/media-react`:

```tsx
import { useMediaEvent } from '@fotowl/media-react';

function EventLogger() {
  useMediaEvent('media:view', (event) => {
    console.log('Viewed:', event.asset.title);
  });

  useMediaEvent('media:download', (event) => {
    console.log('Downloaded:', event.asset.title);
  });

  return null;
}
```
