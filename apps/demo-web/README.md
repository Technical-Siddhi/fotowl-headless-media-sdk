# `@fotowl/demo-web`

A recruiter-facing React demonstration application showcasing the full **FotoOwl Headless Media SDK** architecture.

---

## 🏗️ Architecture

The application consumes the SDK in a strictly layered, decoupled hierarchy:

```
Pexels API
    ↓
@fotowl/media-core       (Framework-agnostic Core SDK)
    ↓
@fotowl/media-react      (React Context & Hooks)
    ↓
@fotowl/media-ui-react   (Headless React UI Primitives)
    ↓
@fotowl/demo-web         (Consumer Application)
```

The application **never** communicates with the Pexels API directly, contains zero hardcoded API endpoints, and zero custom caching or state-management libraries (e.g. Redux, Axios, React Query).

---

## 🚀 Environment Setup & Running Locally

1. Copy `.env.example` to `.env` inside `apps/demo-web/`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and set your Pexels API Key:
   ```env
   VITE_PEXELS_API_KEY=your_actual_pexels_api_key
   ```

3. Run development server:
   ```bash
   pnpm --filter @fotowl/demo-web dev
   ```

4. Run test suite:
   ```bash
   pnpm --filter @fotowl/demo-web test
   ```

5. Production build:
   ```bash
   pnpm --filter @fotowl/demo-web build
   ```

---

## ⭐ Features Demonstrated

1. **`MediaSDKProvider` Integration**: Context-driven initialization and configuration.
2. **Search Catalog (`useMediaSearch`)**: Live photo catalog search with request deduplication and race-condition protection.
3. **Curated Showcase (`useCuratedMedia`)**: Featured photo collection.
4. **Detail View & Tracking (`MediaModal` & `sdk.trackView`)**: Accessible modal dialog for detailed asset metadata and view analytics tracking.
5. **Asset Download & Tracking (`sdk.trackDownload`)**: Actionable asset downloads paired with SDK analytics event emission.
6. **Live Event Stream (`useMediaEvent`)**: Real-time event activity logger widget responding to `media:view` and `media:download` events.
7. **Responsive & Accessible UI**: Mobile-first glassmorphic styling, keyboard navigation (Tab, Enter, Space, Escape), `role="dialog"`, and focus restoration.
