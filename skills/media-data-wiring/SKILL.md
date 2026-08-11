# Media Data Wiring Skill

## Purpose

Use this skill when building or modifying application code that needs to retrieve media, authenticate with the media SDK, search/paginate media, or subscribe to media activity events.

This skill teaches an AI coding agent how to consume the FotoOwl media packages correctly.

The packages are intentionally separated:

```text
web app
   │
   ├── media-react
   │      │
   │      └── media-core
   │
   └── media-ui-react
```

The application is the composition layer.

`media-react` provides data/auth/event access.

`media-ui-react` provides headless UI behavior.

Never make either package depend on the other.

---

## 1. Non-negotiable dependency rules

When writing application code:

### Allowed

```text
app → media-react
app → media-ui-react
media-react → media-core
media-native → media-core
```

### Forbidden

```text
media-ui-react → media-core
media-ui-react → media-react
media-react → media-ui-react
media-core → React
media-core → React Native
media-core → DOM
```

The UI packages must not know that Pexels or the SDK exists.

Do not solve an application problem by adding an import from `media-core` into a UI component.

If application code needs SDK functionality, use the public `media-react` API.

---

# 2. Data flow

For web application data wiring, use this direction:

```text
Pexels
   ↓
media-core
   ↓
media-react
   ↓
application state
   ↓
media-ui-react
   ↓
consumer markup
```

The UI package receives data from the application.

It does not fetch the data itself.

Correct:

```tsx
const { data, isLoading, error } = useMediaSearch({
  query,
});

const items = data?.items ?? [];

const grid = useMediaGrid({
  items,
});
```

Incorrect:

```tsx
function MediaGrid() {
  const { data } = useMediaSearch(...);
}
```

if `MediaGrid` belongs to `media-ui-react`.

`media-ui-react` must remain independent of `media-react`.

---

# 3. Provider setup

The application must initialize the React SDK through its provider.

Use the public provider exported by `media-react`.

Example:

```tsx
import {
  MediaProvider,
} from "media-react";

export function App() {
  return (
    <MediaProvider
      apiKey={import.meta.env.VITE_PEXELS_API_KEY}
    >
      <MediaApp />
    </MediaProvider>
  );
}
```

Keep authentication setup at the application/wrapper boundary.

Do not:

* put the API key in `media-ui-react`
* import the Pexels client directly into application components
* pass the API key into every UI component
* expose the API key through UI props
* duplicate client initialization in multiple components

Prefer one provider near the application root.

---

# 4. Environment variables

The web application owns environment-specific configuration.

Use the application's environment mechanism:

```text
VITE_PEXELS_API_KEY
```

Do not hard-code the key:

```tsx
// WRONG
const apiKey = "123456...";
```

Do not put the key in:

```text
media-ui-react
media-ui-native
shared UI components
```

The provider receives the configured key.

---

# 5. Searching media

Use `useMediaSearch` for application-level search.

Typical usage:

```tsx
const {
  data,
  isLoading,
  error,
  search,
} = useMediaSearch({
  query,
  mediaType: "all",
  perPage: 20,
});
```

Treat the returned data as SDK-owned data.

Do not transform the SDK response into a UI-specific structure unless the application actually needs a view-model.

For a simple gallery, pass the media items directly to the headless UI package:

```tsx
const items = data?.items ?? [];

<MediaGallery items={items} />
```

---

# 6. Search state belongs to the application

The application owns:

* search text
* selected media item
* loading/error presentation
* current view
* pagination decisions
* whether reels are open
* whether the Lightbox is open

Example:

```tsx
const [query, setQuery] = useState("nature");
const [selectedItem, setSelectedItem] =
  useState<MediaItem | null>(null);
```

Do not put application search state inside `media-ui-react`.

The UI package should receive data and callbacks.

---

# 7. Triggering a search

Search actions should originate from the application.

Example:

```tsx
async function handleSearch(
  value: string,
) {
  const nextQuery = value.trim();

  if (!nextQuery) {
    return;
  }

  setQuery(nextQuery);

  await search({
    query: nextQuery,
    mediaType: "all",
    page: 1,
    perPage: 20,
  });
}
```

Do not make a UI component responsible for knowing how the SDK searches.

A search form should call:

```tsx
onSearch(query)
```

The application decides what SDK operation follows.

---

# 8. Loading and errors

Always account for the SDK's loading and error states.

Minimum application behavior:

```tsx
{isLoading && (
  <p role="status">
    Loading media...
  </p>
)}

{error && (
  <p role="alert">
    {error.message}
  </p>
)}
```

Do not hide SDK errors inside a UI package.

The application decides how errors should be presented.

Avoid swallowing errors:

```tsx
try {
  await search(...);
} catch {
  // nothing
}
```

unless the application has an intentional recovery strategy.

---

# 9. Pagination and load-more

When implementing pagination, keep the responsibility split clear.

`media-react` owns access to SDK pagination behavior.

The application decides when more data should be requested.

`media-ui-react` may detect that the user reached the end of a list through its headless Grid API, but it must not import `media-react` and fetch more data itself.

Correct conceptual flow:

```text
user reaches end
      ↓
media-ui-react detects load-more condition
      ↓
application callback
      ↓
media-react search/load-more operation
      ↓
new items
      ↓
application updates data
      ↓
UI receives new items
```

Never implement:

```text
media-ui-react
      ↓
useMediaSearch()
```

That violates the package boundary.

---

# 10. Filtering videos for the Reels experience

If the application needs a Reels view, derive video items from the application's media data.

Example:

```tsx
const videoItems = items.filter(
  (item) => item.type === "video",
);
```

Then pass those items to `media-ui-react`.

```tsx
<ReelsView
  items={videoItems}
/>
```

The Reel UI does not query Pexels.

It does not know what makes an item a Pexels video.

The application performs the data selection.

---

# 11. Event subscriptions

The SDK supports activity events.

At minimum the application should be able to subscribe to:

```text
view
download
```

Use the `media-react` event hook rather than importing an event emitter directly from `media-core`.

Example:

```tsx
import {
  useMediaEvent,
} from "media-react";

export function MediaEventLogger() {
  useMediaEvent("view", (event) => {
    console.log(
      "[FotoOwl] view",
      event,
    );
  });

  useMediaEvent("download", (event) => {
    console.log(
      "[FotoOwl] download",
      event,
    );
  });

  return null;
}
```

Mount the subscriber inside the provider:

```tsx
<MediaProvider
  apiKey={apiKey}
>
  <MediaEventLogger />
  <MediaApp />
</MediaProvider>
```

This demonstrates that the application can independently observe SDK activity.

---

# 12. Event emission belongs at the application interaction boundary

When the application determines that a user viewed or downloaded media, use the SDK's public tracking API.

For example:

```tsx
function handleSelect(item: MediaItem) {
  setSelectedItem(item);

  client.track("view", {
    mediaId: String(item.id),
    mediaType: item.type,
    timestamp: Date.now(),
  });
}
```

For a download:

```tsx
function handleDownload(
  item: MediaItem,
) {
  // perform the application download

  client.track("download", {
    mediaId: String(item.id),
    mediaType: item.type,
    timestamp: Date.now(),
  });
}
```

The exact method name must match the public `media-react` contract in this repository.

Do not invent a new event API in application code.

Do not import the internal emitter from `media-core` just because it is available.

---

# 13. Keep event handling out of UI packages

Do not write:

```tsx
// WRONG: inside media-ui-react

import { useMediaEvent } from "media-react";
```

or:

```tsx
// WRONG

import { MediaClient } from "media-core";
```

The UI package can expose callbacks such as:

```tsx
onItemSelect
onActiveChange
onDownload
```

The application decides whether those callbacks should result in SDK activity events.

Example:

```text
Grid
  ↓
onItemSelect(item)
  ↓
application
  ├── open Lightbox
  └── track view
```

This keeps UI behavior reusable with any data source.

---

# 14. Do not duplicate SDK business logic

The application should not recreate functionality already provided by `media-react`/`media-core`.

Avoid writing a second Pexels client:

```tsx
fetch("https://api.pexels.com/...")
```

inside the application.

Avoid:

```tsx
class PexelsService {}
```

inside the application.

Avoid:

```tsx
axios.get(...)
```

for operations already supported by the SDK.

The application consumes the SDK.

It does not compete with it.

---

# 15. Do not pass SDK clients into UI components

Avoid:

```tsx
<MediaGrid
  client={client}
/>
```

Avoid:

```tsx
<Lightbox
  mediaClient={client}
/>
```

Avoid:

```tsx
<ReelSwiper
  search={search}
/>
```

Instead pass data and UI callbacks:

```tsx
<MediaGrid
  items={items}
  onSelect={handleSelect}
/>
```

The UI package should be usable with:

```text
Pexels
Unsplash
local JSON
mock data
database results
another SDK
```

without modification.

---

# 16. Use the app as the composition layer

When an implementation requires both SDK data and headless UI behavior, compose them in the app.

Example:

```tsx
function MediaApp() {
  const {
    data,
    isLoading,
  } = useMediaSearch({
    query,
  });

  const items = data?.items ?? [];

  const grid = useMediaGrid({
    items,
    onItemSelect: handleSelect,
  });

  return (
    <div {...grid.getGridProps()}>
      {items.map((item) => (
        <article
          key={item.id}
          {...grid.getItemProps(item)}
        >
          ...
        </article>
      ))}
    </div>
  );
}
```

This is the preferred composition pattern.

---

# 17. Public API discipline

Only consume exports from the package's public entry point.

Prefer:

```tsx
import {
  MediaProvider,
  useMediaSearch,
  useMediaEvent,
} from "media-react";
```

Do not reach into package internals:

```tsx
// WRONG
import {
  useMediaSearch,
} from "media-react/src/hooks/use-media-search";
```

Do not import implementation files from:

```text
media-core/src/
media-react/src/
```

unless the repository explicitly exposes that path as a supported public API.

---

# 18. When modifying existing application code

Before changing data wiring:

1. Inspect the existing `media-react` public exports.
2. Inspect the hook's actual return shape.
3. Reuse the existing provider.
4. Reuse the existing event API.
5. Preserve the dependency direction.
6. Pass plain data/callbacks into `media-ui-react`.
7. Do not introduce a second data-fetching abstraction.

If an API appears to be missing, **do not silently invent it**.

First inspect the package implementation and public `index.ts`.

---

# 19. AI agent checklist

Before submitting a data-wiring change, verify:

### Provider

* [ ] `MediaProvider` is mounted once at the application root.
* [ ] API credentials come from application configuration.
* [ ] No API key is hard-coded.
* [ ] UI packages do not receive authentication configuration.

### Data

* [ ] Search uses `media-react`.
* [ ] Application owns query/search state.
* [ ] Loading state is represented.
* [ ] Error state is represented.
* [ ] Pagination/load-more does not cause `media-ui-react` to import `media-react`.
* [ ] Video filtering happens in the application.

### Events

* [ ] `view` events can be subscribed to through `media-react`.
* [ ] `download` events can be subscribed to through `media-react`.
* [ ] Event subscriptions are cleaned up by the hook.
* [ ] UI packages do not import the SDK.
* [ ] Event tracking occurs at application interaction boundaries.

### Boundaries

* [ ] App may import `media-react`.
* [ ] App may import `media-ui-react`.
* [ ] `media-react` may adapt `media-core`.
* [ ] `media-ui-react` does not import `media-core`.
* [ ] `media-ui-react` does not import `media-react`.
* [ ] Application code does not recreate the Pexels client.
* [ ] No package-internal source paths are imported.

---

## 20. Decision rule

When unsure where code belongs, ask:

> "Does this code need to know about the media SDK, or does it only need data and UI behavior?"

If it needs the SDK:

```text
media-react / application
```

If it only needs data and interaction behavior:

```text
media-ui-react
```

If it implements provider-independent SDK functionality:

```text
media-core
```

If it combines SDK data with UI behavior:

```text
application
```

Never move SDK knowledge downward into the headless UI layer just to make application code shorter.

---

## 21. Expected application architecture

A correctly wired web application should look approximately like:

```text
apps/web
│
├── MediaProvider                  ← media-react
│
├── MediaEventLogger               ← media-react events
│
├── SearchBar                      ← app UI
│      │
│      └── onSearch()
│             │
│             ▼
│        useMediaSearch()          ← media-react
│             │
│             ▼
│          MediaItem[]
│             │
│             ├───────────────┐
│             ▼               ▼
│       useMediaGrid()   filter videos
│       ← media-ui-react      │
│             │               ▼
│             │        useMediaReelSwiper()
│             │        ← media-ui-react
│             ▼
│          select
│             │
│             ▼
│       useMediaLightbox()
│       ← media-ui-react
│
└── application event handlers
        │
        ├── view
        └── download
```

This structure keeps the application as the only integration point between SDK data and headless UI behavior.

---

## Do not

* Import `media-core` directly from the web app when a `media-react` API exists.
* Import `media-react` from `media-ui-react`.
* Import `media-core` from `media-ui-react`.
* Put Pexels API calls in UI components.
* Put API keys in UI components.
* Put search state in the headless component package.
* Make the Grid fetch its own data.
* Make the Reel Swiper fetch videos.
* Make the Lightbox know about Pexels.
* Pass an SDK client into headless components.
* Import package internals instead of public APIs.
* Invent APIs without checking the package's actual public contract.

The goal is not merely to make the feature work. The goal is to preserve the SDK/component boundary while making the application easy for another coding agent to extend.
