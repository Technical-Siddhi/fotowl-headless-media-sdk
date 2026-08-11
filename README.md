# FotoOwl Headless Media SDK

A TypeScript-based headless media SDK monorepo separating framework-agnostic media engine logic from React adapters and reusable UI components. Built for the FotoOwl React Developer take-home assignment.

- [Live Demo App](https://fotowl-headless-media-sdk-demo-web.vercel.app/)
- [Documentation Home](https://fotowl-headless-media-sdk-docs.vercel.app/)
- [SDK Documentation](https://fotowl-headless-media-sdk-docs.vercel.app/guide/)
- [Components Documentation](https://fotowl-headless-media-sdk-docs.vercel.app/components/)
- [GitHub Repository](https://github.com/Technical-Siddhi/fotowl-headless-media-sdk)

---

## Key Features

- Framework-Agnostic Media Core: Pure TypeScript engine (`@fotowl/media-core`) free of DOM and React dependencies.
- React Adapter & Custom Hooks: Provider context (`<MediaSDKProvider>`) and custom hooks (`useMediaSDK`, `useMediaSearch`, `useCuratedMedia`, `useMediaItem`, `useMediaEvent`).
- Headless React UI Components: Accessible, unstyled primitives (`MediaGrid`, `MediaCard`, `MediaSearch`, `MediaPagination`, `MediaModal`, `useMediaUI`).
- In-Memory TTL Caching: Response caching and request deduplication.
- Provider Abstraction: Unified domain models (`MediaAsset`, `MediaSearchResult`) masking API provider details (Pexels REST API integration).
- Event & Telemetry System: Pub/sub event broadcaster tracking `media:view` and `media:download` activity events.
- Strict TypeScript: Strict compiler safety across all packages with zero implicit `any`.
- Vitest Testing Suite: Comprehensive unit and integration test coverage across all packages.
- Vite React Demo Application: Interactive recruiter showcase application deployed on Vercel.
- VitePress Documentation: Deployed static documentation site for SDK APIs and UI components.

---

## Architecture Overview

```text
Demo Web App (apps/demo-web)
    ↓
React UI Components (@fotowl/media-ui-react)
    ↓
React Adapter / Hooks (@fotowl/media-react)
    ↓
Media Core SDK (@fotowl/media-core)
    ↓
Provider / Cache / Events
```

The system follows a strict unidirectional dependency architecture, decoupling networking and caching logic from visual UI components.

---

## Monorepo Structure

```text
fotowl-headless-media-sdk/
├── apps/
│   └── demo-web/           # Vite + React demo application
├── packages/
│   ├── media-core/         # Framework-agnostic SDK engine
│   ├── media-react/        # React provider and hooks
│   ├── media-ui-react/     # Headless React UI primitives
│   ├── media-native/       # React Native core integration
│   └── media-ui-native/    # React Native UI primitives
├── docs/                   # VitePress documentation
└── skills/                 # Architectural integration guidance
```

### Package Responsibilities

- `apps/demo-web`: Vite + React showcase application demonstrating live search, curated showcases, pagination, detail modals, favorites, and live event logging.
- `packages/media-core`: Core framework-agnostic TypeScript SDK engine handling provider abstraction, TTL caching, deduplication, and EventEmitter telemetry.
- `packages/media-react`: React integration layer providing `MediaSDKProvider`, `useMediaSDK`, `useMediaSearch`, `useCuratedMedia`, `useMediaItem`, and `useMediaEvent`.
- `packages/media-ui-react`: Reusable headless React UI components (`MediaGrid`, `MediaCard`, `MediaSearch`, `MediaPagination`, `MediaModal`, `useMediaUI`).
- `packages/media-native`: React Native core SDK integration wrapper.
- `packages/media-ui-native`: Unstyled React Native UI primitives.
- `docs`: VitePress static documentation site.
- `skills`: Architectural guidance blueprints for pair-programming agents.

---

## Development Commands

Run monorepo commands from the workspace root:

```bash
# Install workspace dependencies
pnpm install

# Run TypeScript type check across all workspace packages
pnpm run typecheck

# Run unit and integration test suites
pnpm run test

# Build production bundle for demo app
pnpm --filter @fotowl/demo-web build

# Build static VitePress documentation site
pnpm --filter @fotowl/docs build

# Start local VitePress documentation dev server
pnpm --filter @fotowl/docs dev
```

---

## Testing & Build Verification

Verified test results across workspace packages:

- `media-core`: 32 / 32 tests passed
- `media-react`: 18 / 18 tests passed
- `media-ui-react`: 21 / 21 tests passed
- `demo-web`: 4 / 4 tests passed
- TypeScript Validation: `pnpm run typecheck` passed cleanly across all workspace packages (`tsc --noEmit`).
- Demo Production Build: `pnpm --filter @fotowl/demo-web build` passed successfully.
- VitePress Documentation Build: `pnpm --filter @fotowl/docs build` passed successfully.

---

## Documentation

Interactive documentation is deployed on Vercel:

- [Documentation Home](https://fotowl-headless-media-sdk-docs.vercel.app/)
- [SDK Documentation](https://fotowl-headless-media-sdk-docs.vercel.app/guide/)
- [Components Documentation](https://fotowl-headless-media-sdk-docs.vercel.app/components/)

Built with VitePress.

---

## Live Demo

- [Live Web Application](https://fotowl-headless-media-sdk-demo-web.vercel.app/)

### Demo Features:
1. Catalog Search: Live search with debouncing and request deduplication.
2. Curated Showcase: Page-driven curated media browsing.
3. Pagination: Page switching using SDK metadata.
4. Media Detail Modal: Accessible dialog displaying asset details and photographer links.
5. Downloads & Favorites: Asset download triggers and favorite state toggling.
6. SDK Telemetry Stream: Real-time log activity widget monitoring `media:view` and `media:download` events.

---

## Submission Links

| Requirement | Verified Deployment URL |
| :--- | :--- |
| GitHub Repository | [https://github.com/Technical-Siddhi/fotowl-headless-media-sdk](https://github.com/Technical-Siddhi/fotowl-headless-media-sdk) |
| Live Demo | [https://fotowl-headless-media-sdk-demo-web.vercel.app/](https://fotowl-headless-media-sdk-demo-web.vercel.app/) |
| SDK Documentation | [https://fotowl-headless-media-sdk-docs.vercel.app/guide/](https://fotowl-headless-media-sdk-docs.vercel.app/guide/) |
| Components Documentation | [https://fotowl-headless-media-sdk-docs.vercel.app/components/](https://fotowl-headless-media-sdk-docs.vercel.app/components/) |

---

## Assignment Notes

This project was developed for the FotoOwl React Developer take-home assignment. It demonstrates a complete headless media SDK architecture, React integration hooks, reusable UI components, unit testing, TypeScript validation, production builds, and deployed documentation.

---

## AI-Assisted Development

AI tools were used transparently during development for architectural discussions, debugging, implementation guidance, documentation drafting, and test verification. The final code implementation, package boundaries, integration hooks, unit tests, and production deployments were reviewed and validated.
