# SDK Overview

The **FotoOwl Headless Media SDK** is a modular TypeScript monorepo providing a framework-agnostic core engine (`@fotowl/media-core`) and React binding package (`@fotowl/media-react`).

## Key Packages

- **`@fotowl/media-core`**: Core TypeScript SDK handling provider authentication, HTTP requests, request deduplication, in-memory TTL caching, and event pub/sub. Completely free of DOM and React dependencies.
- **`@fotowl/media-react`**: React integration wrapper providing `MediaSDKProvider`, `useMediaSDK`, `useMediaSearch`, `useCuratedMedia`, `useMediaItem`, and `useMediaEvent`.

## Core Features

- **Provider Abstraction**: Unified domain interfaces (`MediaAsset`, `MediaSearchResult`) masking provider-specific API details.
- **In-Memory Caching**: Configurable TTL cache for quick response retrieval and request deduplication.
- **Event Telemetry**: Built-in `EventEmitter` broadcasting `media:view` and `media:download` activity events.
- **Strict Error Handling**: Categorized error types (`AuthenticationError`, `ValidationError`, `RateLimitError`, `NetworkError`, `ProviderError`).
