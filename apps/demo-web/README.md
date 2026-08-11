# 🦅 FotoOwl Headless Media SDK — Web Demo Application (`@fotowl/demo-web`)

> A recruiter-facing React showcase application demonstrating the production capabilities, architectural boundaries, and developer experience of the **FotoOwl Headless Media SDK**.

---

## 📋 1. Project Overview

`apps/demo-web` is a modern React application built to showcase the full end-to-end capabilities of the **FotoOwl Headless Media SDK**. 

The purpose of a **headless media SDK architecture** is to completely separate media business logic (API integration, authentication, data fetching, request deduplication, memory caching, and event lifecycle telemetry) from the UI layer. Application developers can build complete, customizable media browsing experiences without ever writing direct API requests or managing complex networking states.

---

## 🏗️ 2. Architecture & Data Flow

The application strictly follows a decoupled, uni-directional dependency flow:

```
Pexels Provider API
       ↓
@fotowl/media-core       (Framework-agnostic Core SDK)
       ↓
@fotowl/media-react      (React Context & Hooks Abstraction)
       ↓
@fotowl/media-ui-react   (Headless React UI Primitives)
       ↓
apps/demo-web         (Recruiter Showcase Application)
```

> 💡 **Architectural Boundary:** `apps/demo-web` does **NOT** directly call the Pexels API, construct network requests, or handle low-level API credentials. All data retrieval and analytics telemetry flow exclusively through `@fotowl/media-react` and `@fotowl/media-ui-react`.

---

## 📦 3. Monorepo Workspace Packages

The FotoOwl monorepo consists of modular, single-responsibility workspace packages:

| Package | Role & Responsibility |
| :--- | :--- |
| **`@fotowl/media-core`** | Framework-agnostic core SDK. Handles Pexels API abstraction, provider interfaces, TTL caching, deduplication, and EventEmitter lifecycle telemetry. |
| **`@fotowl/media-react`** | React integration layer. Provides `MediaSDKProvider`, `useMediaSDK`, `useMediaSearch`, `useCuratedMedia`, `useMediaItem`, and `useMediaEvent`. |
| **`@fotowl/media-ui-react`** | Reusable, headless React UI components (`MediaSearch`, `MediaGrid`, `MediaCard`, `MediaModal`, `MediaPagination`, `MediaLoading`, `MediaError`, `useMediaUI`). |
| **`@fotowl/media-native`** | React Native core integration layer for mobile cross-platform support. |
| **`@fotowl/media-ui-native`** | React Native headless UI primitives for mobile applications. |
| **`apps/demo-web`** | Production web showcase app consuming `@fotowl/media-react` and `@fotowl/media-ui-react`. |

---

## ⭐ 4. Implemented Demo Features

- **Search Catalog (`MediaSearch` & `useMediaSearch`)**: Live photo catalog search with debounce and race-condition safety.
- **Curated Showcase (`useCuratedMedia`)**: Page-driven curated media browsing.
- **Responsive Media Grid (`MediaGrid` & `MediaCard`)**: 2-column desktop and responsive single-column mobile/tablet media cards.
- **Media Detail Modal (`MediaModal`)**: Accessible dialog showing high-resolution preview and metadata (dimensions, type, author info).
- **Download Action (`onDownload`)**: Triggers asset downloads alongside `sdk.trackDownload()` telemetry.
- **Pagination (`MediaPagination`)**: Controls page switching using SDK pagination metadata (`hasNext`, `hasPrev`, `page`).
- **Loading & Error Handling (`MediaLoading` & `MediaError`)**: Graceful UI states for pending requests and API errors.
- **Missing API Key Warning Banner**: Helpful developer warning when `VITE_PEXELS_API_KEY` is not set.
- **Live SDK Event Activity Stream (`EventActivity`)**: Real-time event log widget listening to `media:view` and `media:download` events.
- **WAI-ARIA Accessibility**: Accessible tab navigation (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`), dialog focus trapping, Escape key closing, and focus restoration.

---

## 🔌 5. SDK Integration Details

The demo application consumes only the higher-level SDK packages (`@fotowl/media-react` and `@fotowl/media-ui-react`):

- **Provider**: `<MediaSDKProvider config={{ apiKey, cache: { ttlMs: 60000 } }}>`
- **Hooks**: `useMediaSearch`, `useCuratedMedia`, `useMediaSDK`, `useMediaEvent`
- **UI Components**: `MediaSearch`, `MediaGrid`, `MediaModal`, `MediaPagination`, `MediaLoading`, `MediaError`, `useMediaUI`

### 🛡️ Strict Boundary Guarantees
- ❌ **Zero `fetch()` or `axios` calls** in `apps/demo-web`
- ❌ **Zero direct Pexels endpoint URLs** (`api.pexels.com`) in `apps/demo-web`
- ❌ **Zero direct `new MediaSDK()` instantiations** inside UI components
- ❌ **Zero external state management libraries** (No Redux, Zustand, or React Query)

---

## 🛠️ 6. Local Setup & Configuration

1. **Install workspace dependencies** from the monorepo root:
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables** for `apps/demo-web`:
   Copy `.env.example` to `.env` inside `apps/demo-web/`:
   ```bash
   cp apps/demo-web/.env.example apps/demo-web/.env
   ```

3. **Set your Pexels API Key** in `apps/demo-web/.env`:
   ```env
   VITE_PEXELS_API_KEY=your_actual_pexels_api_key_here
   ```

> 🔒 **Security Notice:** `apps/demo-web/.env` is ignored by Git and will never be committed. `.env.example` contains only placeholder values.

---

## 🚀 7. Running the Application

Launch the Vite development server for `demo-web`:

```bash
pnpm --filter @fotowl/demo-web dev
```

The application will run at **`http://localhost:3000/`** (or `http://localhost:3001/` if port 3000 is occupied).

---

## 🧪 8. Testing Suite

Run the Vitest integration suite for `demo-web`:

```bash
pnpm --filter @fotowl/demo-web test
```

### Coverage (4 Unit & Integration Tests)
- **Application Layout & Header**: Verifies header rendering, hero section, and SDK banner status.
- **Mode Switching**: Verifies tab switching between Search Catalog and Curated Showcase.
- **Event Activity Initial State**: Confirms empty event stream rendering.
- **Live Event Stream Telemetry**: Confirms real-time event updates upon `media:view` and `media:download` triggers.

---

## 🔍 9. Type Checking

Verify TypeScript type correctness across all workspace packages:

```bash
pnpm run typecheck
```

All workspace packages pass TypeScript `--noEmit` validation cleanly.

---

## 📦 10. Production Build

Build the optimized web bundle:

```bash
pnpm --filter @fotowl/demo-web build
```

The production output is generated in `apps/demo-web/dist/`.

---

## 🌐 11. API Boundary Rationale

In modern enterprise frontend architecture, client applications should not directly couple themselves to third-party provider endpoints (such as Pexels). 

By delegating network execution, HTTP header construction, rate limiting, and response normalization to `@fotowl/media-core`, the `apps/demo-web` application remains:
1. **Provider Agnostic**: The underlying media API provider can be swapped without touching application code.
2. **Type Safe**: The app works against normalized `MediaAsset` contracts rather than provider-specific JSON schemas.
3. **Resilient**: Automatic request deduplication and in-memory TTL caching are handled invisibly by the SDK layer.

---

## ♿ 12. Accessibility Compliance

- **Semantic HTML**: Single `<h1>` logo title, structured `<h2>` hero title, and `<h3>` widget section headings.
- **Form Controls**: Accessible `<label for="media-search-input">` search input styling.
- **WAI-ARIA Tab Semantics**: Mode switcher container features `role="tablist"` (`aria-label="Media browsing mode"`) with `role="tab"`, `aria-selected`, and `aria-controls="panel-search"` / `"panel-curated"` attributes.
- **Modal Dialog (`role="dialog"`)**: Features `aria-modal="true"`, `aria-labelledby`, Escape key close handler, and focus restoration to the trigger button upon close.

---

## 🔒 13. Security Practices

- **Browser Environment Variables**: Read safely via `import.meta.env.VITE_PEXELS_API_KEY`.
- **Zero Committed Secrets**: `.env` files are ignored via `.gitignore`; only `.env.example` placeholder template is tracked.
- **Graceful Unconfigured Fallback**: Missing API keys render a developer warning banner without crashing or making unauthorized API calls.

---

## ✅ 14. Final Validation Status

| Requirement / Audit Check | Status | Verification Result |
| :--- | :---: | :--- |
| **Unit & Integration Tests** | **PASS** | 4 / 4 passed (`vitest run`) |
| **Monorepo Typecheck** | **PASS** | `tsc --noEmit` passed across all workspace packages |
| **Production Build** | **PASS** | Vite production bundle created cleanly (`dist/`) |
| **Pexels API Boundary Audit** | **PASS** | 0 direct Pexels API calls / fetch / axios in `demo-web/src` |
| **Direct `@fotowl/media-core` Dependency** | **REMOVED** | Removed from `apps/demo-web/package.json` |
| **Fallback Hardcoded Key** | **REMOVED** | Replaced with safe unconfigured state handling |
| **WAI-ARIA Tab Semantics** | **PASS** | Explicit `role="tablist"`, `role="tab"`, `aria-selected` added |
