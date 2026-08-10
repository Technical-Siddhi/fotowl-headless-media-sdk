# `@fotowl/media-ui-react`

Reusable, headless React UI primitives for rendering and interacting with media assets provided by `@fotowl/media-react` and `@fotowl/media-core`.

---

## 🏗️ Architecture & Dependency Direction

```
Application Component / UI Layer
       ↓
@fotowl/media-ui-react  (Headless UI Components & Primitives)
       ↓
@fotowl/media-react     (React Context & Hooks)
       ↓
@fotowl/media-core      (Framework-agnostic SDK Core)
       ↓
MediaProvider / Pexels Provider
```

`@fotowl/media-ui-react` has **zero direct network calls**, zero Pexels API coupling, and zero hardcoded design system dependencies. It relies exclusively on `@fotowl/media-react` hooks and `@fotowl/media-core` asset models.

---

## 📦 Installation & Usage

```json
{
  "dependencies": {
    "@fotowl/media-core": "workspace:*",
    "@fotowl/media-react": "workspace:*",
    "@fotowl/media-ui-react": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

---

## 🧩 Components

### 1. `MediaCard`
Data-driven presentation card component accepting a normalized `MediaAsset`.

```tsx
import { MediaCard } from '@fotowl/media-ui-react';

<MediaCard
  asset={asset}
  onSelect={(asset) => console.log('Selected:', asset)}
  onDownload={(asset) => console.log('Download:', asset)}
  className="custom-card"
/>
```

### 2. `MediaGrid`
Grid layout container for collections of `MediaAsset` items. Supports custom item renderers and empty states.

```tsx
import { MediaGrid } from '@fotowl/media-ui-react';

<MediaGrid
  assets={assets}
  onSelectAsset={handleSelect}
  emptyState={<p>No media found</p>}
/>
```

### 3. `MediaSearch`
Full search interface component that integrates automatically with `useMediaSearch` from `@fotowl/media-react` and `MediaPagination`.

```tsx
import { MediaSearch } from '@fotowl/media-ui-react';

<MediaSearch
  initialQuery="mountains"
  perPage={12}
  onSelectAsset={handleSelectAsset}
/>
```

### 4. `MediaModal`
Accessible modal dialog (`role="dialog"`, `aria-modal="true"`) for displaying detailed asset view. Supports Keyboard `Escape` key close and focus restoration.

```tsx
import { MediaModal, useMediaUI } from '@fotowl/media-ui-react';

function App() {
  const { selectedAsset, isModalOpen, openAsset, closeAsset } = useMediaUI();

  return (
    <>
      <button onClick={() => openAsset(someAsset)}>View Detail</button>
      <MediaModal
        isOpen={isModalOpen}
        asset={selectedAsset}
        onClose={closeAsset}
      />
    </>
  );
}
```

### 5. `MediaPagination`
Controlled pagination control component.

```tsx
import { MediaPagination } from '@fotowl/media-ui-react';

<MediaPagination
  page={currentPage}
  totalPages={10}
  onPageChange={(newPage) => setPage(newPage)}
/>
```

### 6. `MediaLoading` & `MediaError`
Accessible status (`role="status"`) loading indicator and safe alert (`role="alert"`) component for rendering user-friendly error messages.

---

## ♿ Accessibility Built-in

- **`MediaCard`**: Keyboard Enter/Space selection, accessible image `alt` text.
- **`MediaModal`**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `Escape` key listener, focus restoration to previous active element on close.
- **`MediaSearch`**: Form label association (`htmlFor`), status region for search execution.
- **`MediaPagination`**: Accessible navigation buttons (`aria-label`), `aria-current="page"` status.
