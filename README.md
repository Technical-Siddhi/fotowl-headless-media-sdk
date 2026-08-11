# FotoOwl Headless Media SDK

> A framework-agnostic, headless media SDK and UI architecture monorepo featuring a production-ready React demo application built for the **FotoOwl React Developer** take-home assignment.

---

## 🌐 Live Demo

🔗 **Production URL:** [https://fotowl-headless-media-sdk-demo-web.vercel.app](https://fotowl-headless-media-sdk-demo-web.vercel.app)

The application is deployed on Vercel from the `main` branch. It provides a complete recruiter-facing showcase of live Pexels media search, curated showcases, detail modals, actionable asset downloads, and real-time SDK lifecycle event telemetry.

---

## 📁 Repository Structure

```
fotowl-headless-media-sdk/
├── apps/
│   └── demo-web/           # Recruiter-facing Web Demo App (Vite + React)
├── packages/
│   ├── media-core/         # Framework-agnostic pure TypeScript SDK engine
│   ├── media-react/        # React integration wrapper & hooks abstraction
│   ├── media-ui-react/     # Headless React UI primitives (Grid, Modal, Search, etc.)
│   ├── media-native/       # React Native core SDK integration wrapper
│   └── media-ui-native/    # React Native headless UI primitives
├── docs/                   # Monorepo architecture & implementation guidelines
└── skills/                 # Agentic context & integration guides
```

### Monorepo Package Responsibilities

- **`apps/demo-web`**: Production web consumer application demonstrating complete SDK integration without directly calling third-party provider APIs.
- **`packages/media-core`**: Core TypeScript SDK. Implements provider adapters (Pexels), HTTP abstraction, request deduplication, in-memory TTL caching, and `EventEmitter` event lifecycle telemetry. Completely free of React/DOM dependencies.
- **`packages/media-react`**: React integration layer exposing `MediaSDKProvider`, `useMediaSDK`, `useMediaSearch`, `useCuratedMedia`, and `useMediaEvent`.
- **`packages/media-ui-react`**: Reusable, unstyled React UI components (`MediaSearch`, `MediaGrid`, `MediaCard`, `MediaModal`, `MediaPagination`, `MediaLoading`, `MediaError`, `useMediaUI`).
- **`packages/media-native`**: React Native core SDK integration wrapper for cross-platform mobile apps.
- **`packages/media-ui-native`**: Unstyled React Native UI primitives for mobile layouts.
- **`docs` & `skills`**: Comprehensive documentation, architectural guidelines, and AI pair-programming integration blueprints.

---

## ⭐ Features

- **Live Media Search**: Search high-resolution Pexels photos with automatic debouncing, race-condition safety, and request deduplication.
- **Curated Media Showcase**: Browse curated photo collections with page-driven pagination.
- **Pagination Controls**: Smooth page navigation using SDK pagination metadata (`hasNext`, `hasPrev`, `page`).
- **Responsive Media Grid**: 2-column desktop grid and responsive mobile/tablet layouts with zero horizontal overflow.
- **Media Detail Modal**: Accessible dialog showcasing high-resolution image preview, dimensions, asset type, and photographer details.
- **Actionable Downloads**: Triggers file downloads while simultaneously firing `sdk.trackDownload()` telemetry events.
- **SDK Event System & Live Stream**: Real-time event log widget (`EventActivity`) responding to `media:view` and `media:download` events.
- **Framework-Agnostic Core**: Pure TypeScript SDK engine usable in Node, React, Vue, Svelte, or React Native.
- **Graceful States & Key Warning**: Handles loading spinners, retriable error states, and unconfigured provider warnings when no API key is set.
- **WAI-ARIA Accessibility**: Accessible tab navigation (`role="tablist"`, `role="tab"`, `aria-selected`), `role="dialog"` focus trapping, Escape key listener, and focus restoration.

---

## 🏗️ Headless SDK Architecture

```
UI / Consumer Application (apps/demo-web)
           ↓
React Adapter (@fotowl/media-react)
           ↓
Headless Media SDK (@fotowl/media-core)
           ↓
Media Provider / API (Pexels API)
```

### Why Headless?
A **headless media SDK** decouples data-fetching, caching, authentication, event telemetry, and networking logic from visual component styling. 

1. **Separation of Concerns**: Application code (`apps/demo-web`) never writes raw `fetch()` or `axios` calls to third-party endpoints.
2. **Reusability**: Core media engine (`@fotowl/media-core`) can be reused across Web, Mobile (React Native), or Server Node.js without modification.
3. **Customizability**: UI components (`@fotowl/media-ui-react`) focus exclusively on rendering and layout, allowing consumer apps full styling freedom.

---

## 💻 Tech Stack

- **Languages & Runtimes**: TypeScript (v5.4), Node.js (v18+)
- **Frontend Framework**: React 18, React DOM
- **Build Tooling**: Vite v5, Vitest v1, pnpm Workspaces
- **Provider API**: Pexels REST API
- **Styling**: Vanilla CSS (Modular, Glassmorphic Design Token System)
- **Testing & Assertions**: Vitest, `@testing-library/react`, Happy DOM

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Technical-Siddhi/fotowl-headless-media-sdk.git
   cd fotowl-headless-media-sdk
   ```

2. **Install workspace dependencies**:
   ```bash
   pnpm install
   ```

---

## 🚀 Development

Start the demo web application dev server from the repository root:

```bash
pnpm dev
# or
pnpm --filter @fotowl/demo-web dev
```

The application will run locally at **`http://localhost:3000/`** (or `http://localhost:3001/` if port 3000 is occupied).

---

## 🔑 Environment Variables

To perform live searches against Pexels locally, create a `.env` file inside `apps/demo-web/`:

```bash
cp apps/demo-web/.env.example apps/demo-web/.env
```

Set your Pexels API Key in `apps/demo-web/.env`:
```env
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```

> 🔒 **Security Notice:** `.env` is ignored by Git and will never be committed. In production (Vercel), environment variables are configured securely via Vercel Project Settings. If no key is provided, the application safely renders an unconfigured warning banner without making unauthorized API requests.

---

## 🧪 Testing & Validation Status

Run full workspace validation from the repository root:

```bash
# 1. Typecheck all 6 workspace packages
pnpm run typecheck

# 2. Run unit & integration test suites across all packages
pnpm run test

# 3. Production build
pnpm run build
```

### Verified Test Results (75 / 75 Tests Passed)

| Package | Test Scope | Status | Passed Tests |
| :--- | :--- | :---: | :---: |
| **`@fotowl/media-core`** | Pexels Provider, SDK Engine, Memory Cache, Event Emitter | **PASS** | 32 / 32 |
| **`@fotowl/media-react`** | `MediaSDKProvider`, Context Hooks, Event Listeners | **PASS** | 18 / 18 |
| **`@fotowl/media-ui-react`** | Headless UI Components (`Grid`, `Modal`, `Search`, `Card`, `Pagination`) | **PASS** | 21 / 21 |
| **`@fotowl/demo-web`** | Header, Tab Navigation, Event Activity Logger | **PASS** | 4 / 4 |
| **TOTAL** | **Full Monorepo Suite** | **PASS** | **75 / 75** |

- **TypeScript Validation:** `pnpm run typecheck` passed cleanly across all workspace packages (`tsc --noEmit`).
- **Production Build:** `pnpm run build` completed cleanly in `< 2` seconds.

---

## 🚀 Deployment

- **Hosting Platform:** Vercel
- **Live URL:** [https://fotowl-headless-media-sdk-demo-web.vercel.app](https://fotowl-headless-media-sdk-demo-web.vercel.app)
- **Deployment Strategy:** Automated CI/CD build from the `main` branch.

---

## 📡 SDK Event System

The SDK provides an internal `EventEmitter` that broadcasts media lifecycle events:

- **`media:view`**: Fired when a user selects and opens a media asset detail view (`sdk.trackView(asset)`).
- **`media:download`**: Fired when a user initiates an asset download (`sdk.trackDownload(asset)`).

In `apps/demo-web`, the `EventActivity` component consumes these events using `useMediaEvent`:

```tsx
useMediaEvent('media:view', (event) => {
  // Update live activity stream UI
});
```

This demonstrates that analytics and event broadcasting are built into the SDK layer, eliminating the need for consumer apps to write custom event tracking code.

---

## 📐 Key Design Decisions

1. **Headless Engine**: Keeps core media logic framework-agnostic so it can be reused across Web, React Native, or Node.js.
2. **Layered Monorepo Architecture**: Clean separation between `@fotowl/media-core` (pure JS/TS), `@fotowl/media-react` (state/context), and `@fotowl/media-ui-react` (rendering).
3. **Consumer App Isolation**: `apps/demo-web` interacts strictly with SDK context and hooks; it imports no direct networking libraries (`axios`/`fetch`) or media endpoint URLs.
4. **Provider-Agnostic Abstraction**: Hides provider-specific Pexels API structures behind unified `MediaAsset` and `MediaSearchResult` domain interfaces.

---

## 🎯 Assignment Evaluation Focus

This repository highlights technical execution across key engineering dimensions:

- **SDK Architecture & Layering**: Strict dependency constraints and uni-directional data flow.
- **TypeScript Quality**: Full type safety, strict compiler options, and zero implicit `any`.
- **React & Hooks Design**: Custom hooks (`useMediaSearch`, `useCuratedMedia`, `useMediaEvent`) managing asynchronous lifecycle cleanly.
- **Component & UI Primitives**: Accessible, unstyled React UI primitives with clean glassmorphic demo styling.
- **Separation of Concerns**: Clear boundary between core SDK networking, React adapters, and consumer applications.
- **Robust Testing**: 75 comprehensive tests covering core logic, hooks, UI primitives, and demo integration.
- **Accessibility & UX**: WAI-ARIA tab semantics, accessible modal dialogs, and responsive CSS grids.
- **Production Readiness**: Vercel deployment, zero-config fallbacks, and clean build tooling.

---

## 🔮 Future Improvements

- **Multi-Provider Support**: Add adapters for Unsplash, Pixabay, or custom self-hosted DAM providers.
- **Advanced Caching**: Persistent IndexedDB/LocalStorage cache storage driver in addition to in-memory TTL caching.
- **Additional Framework Adapters**: Vue (`@fotowl/media-vue`) and Svelte (`@fotowl/media-svelte`) wrapper packages.
- **Package Publishing**: Automated Changesets workflow for publishing packages to npm.
- **Enhanced Search Filters**: Support orientation (landscape/portrait) and color filters in UI primitives.

---

## 👨‍💻 Author

**Siddhi Raj (Technical-Siddhi)**  
- GitHub: [https://github.com/Technical-Siddhi/fotowl-headless-media-sdk](https://github.com/Technical-Siddhi/fotowl-headless-media-sdk)
- Live App: [https://fotowl-headless-media-sdk-demo-web.vercel.app](https://fotowl-headless-media-sdk-demo-web.vercel.app)
