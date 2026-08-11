# Media UI Components Skill

## Purpose

Use this skill when building or modifying application UI that consumes the FotoOwl `media-ui-react` headless component package.

This skill teaches an AI coding agent how to use the Grid, Lightbox, and Reel Swiper correctly without breaking the headless architecture.

The most important rule is:

> `media-ui-react` owns interaction behavior. The application owns markup, styling, layout, and media rendering.

The components must remain usable with arbitrary data sources. They must not know about Pexels, `media-core`, or `media-react`.

---

# 1. Headless means behavior without presentation

`media-ui-react` is a headless UI package.

It provides:

* React hooks
* state
* interaction behavior
* keyboard handling
* focus management
* accessibility attributes
* prop-getters
* active-item detection
* paging/load-more behavior

It does NOT provide:

* rendered UI
* CSS
* visual themes
* colors
* spacing
* typography
* card designs
* image layouts
* modal designs
* video controls

The consumer supplies the actual markup and CSS.

Correct:

```tsx
const grid = useMediaGrid({
  items,
  onItemSelect,
});

return (
  <div
    {...grid.getGridProps()}
    className="my-grid"
  >
    {items.map((item) => (
      <article
        key={item.id}
        {...grid.getItemProps(item)}
        className="my-card"
      >
        ...
      </article>
    ))}
  </div>
);
```

Incorrect:

```tsx
<MediaGrid
  items={items}
/>
```

if `MediaGrid` internally decides the DOM structure and ships the visual design as part of `media-ui-react`.

---

# 2. Dependency boundary

Application code may import:

```text
media-ui-react
```

`media-ui-react` must NOT import:

```text
media-core
media-react
media-native
media-ui-native
```

The UI package receives data and callbacks.

Correct:

```text
app
 ├── media-react
 │      └── data
 │
 └── media-ui-react
        └── behavior
```

Incorrect:

```text
media-ui-react
      ↓
media-react
      ↓
media-core
```

Never solve a UI problem by introducing an SDK dependency into the UI package.

---

# 3. Data ownership

The application owns the data.

Example:

```tsx
const {
  data,
} = useMediaSearch({
  query,
});

const items = data?.items ?? [];
```

Then:

```tsx
const grid = useMediaGrid({
  items,
});
```

The UI hook should not:

* fetch media
* search Pexels
* authenticate
* access an SDK client
* subscribe to SDK events
* transform API responses into Pexels-specific structures

It should work with plain application data.

---

# 4. Prop-getters are the primary API

A prop-getter returns the behavior and accessibility props that the consumer applies to its own element.

Example:

```tsx
<div
  {...grid.getGridProps()}
>
```

and:

```tsx
<article
  {...grid.getItemProps(item)}
>
```

The consumer remains responsible for choosing the element.

The hook should not require:

```tsx
<MediaGrid />
```

or dictate:

```tsx
<div className="media-grid">
```

The consumer chooses both.

---

# 5. Do not override prop-getter behavior accidentally

When using a prop-getter, spread the returned props onto the intended element.

Preferred:

```tsx
<button
  {...lightbox.getCloseButtonProps()}
  className="close-button"
>
  Close
</button>
```

If the application needs additional behavior, compose it deliberately rather than replacing the returned handler.

Be careful with:

```tsx
<button
  onClick={myHandler}
  {...getProps()}
>
```

because the prop-getter may overwrite `onClick`.

Prefer:

```tsx
const closeProps =
  lightbox.getCloseButtonProps();

<button
  {...closeProps}
  onClick={(event) => {
    closeProps.onClick?.(event);
    myHandler(event);
  }}
>
```

when both handlers are genuinely required.

Do not silently discard accessibility or interaction handlers supplied by the hook.

---

# 6. Grid

The Grid provides interaction behavior around a collection of media items.

Typical usage:

```tsx
const grid = useMediaGrid({
  items,
  onItemSelect: handleSelect,
});
```

The application renders the collection:

```tsx
<div
  {...grid.getGridProps()}
  className="media-grid"
>
  {items.map((item) => (
    <article
      key={item.id}
      {...grid.getItemProps(item)}
      className="media-card"
    >
      ...
    </article>
  ))}
</div>
```

The UI package does not decide whether the consumer uses:

```text
CSS Grid
CSS columns
Flexbox
masonry
virtualized layout
list layout
```

The consumer chooses.

---

# 7. Grid item markup

The application decides how each item is represented.

For example:

```tsx
<article
  {...grid.getItemProps(item)}
>
  <button
    {...grid.getSelectButtonProps(item)}
  >
    <img
      {...grid.getImageProps(item)}
      src={item.thumbnailUrl}
      alt={item.title ?? ""}
    />
  </button>
</article>
```

The headless package should not assume that every consumer wants an `<img>`.

A consumer might instead render:

```tsx
<video />
```

or:

```tsx
<picture />
```

or:

```tsx
<canvas />
```

or a custom media renderer.

Do not introduce Pexels-specific rendering into the Grid.

---

# 8. Grid load-more / infinite scrolling

The assignment requires the Grid to support infinite scroll/load-more.

The UI component can detect that the consumer has reached the end of the current collection.

It must communicate that through a callback.

Conceptually:

```tsx
const grid = useMediaGrid({
  items,
  onLoadMore,
});
```

The application decides what `onLoadMore` does.

Correct:

```text
Grid detects end
      ↓
onLoadMore()
      ↓
application
      ↓
media-react
      ↓
fetch next page
      ↓
new items
      ↓
Grid receives new items
```

Incorrect:

```text
Grid
 ↓
media-react
 ↓
fetch next page
```

Never import the SDK into `media-ui-react`.

---

# 9. Grid styling contract

`media-ui-react` ships no styles.

Do not add:

```css
.media-grid {
  display: grid;
}
```

to the component package.

Do not add:

```css
button {
  background: blue;
}
```

Do not add default:

* colors
* spacing
* borders
* shadows
* typography
* animations

The application may style the generated elements:

```tsx
<div
  {...grid.getGridProps()}
  className="gallery-grid"
/>
```

and:

```css
.gallery-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 16px;
}
```

This is the intended headless contract.

---

# 10. Lightbox

The Lightbox provides behavior, not visual presentation.

It should manage:

* open/closed state
* close behavior
* Escape handling
* focus handling
* dialog semantics
* focus restoration

The application controls:

* backdrop markup
* dialog markup
* image/video rendering
* buttons
* layout
* styling

Typical usage:

```tsx
const lightbox =
  useMediaLightbox({
    open: true,
    onClose,
  });
```

Then:

```tsx
<div
  {...lightbox.getBackdropProps()}
>
  <section
    {...lightbox.getDialogProps()}
  >
    ...
  </section>
</div>
```

---

# 11. Lightbox accessibility is behavior, not styling

A Lightbox must be usable from the keyboard.

At minimum:

```text
Open
 ↓
focus enters dialog
 ↓
Tab stays within dialog
 ↓
Escape closes
 ↓
focus returns to opener
```

Do not remove the keyboard handlers supplied by the hook.

Do not replace accessible dialog semantics with a visually similar `<div>`.

Do not assume that `position: fixed` makes something an accessible dialog.

---

# 12. Focus restoration

The application should identify the element that opened the Lightbox.

The Lightbox behavior should restore focus when it closes.

If the package's API exposes an opener/ref mechanism, use it rather than manually implementing a second focus system in the application.

Do not create competing focus-management logic.

Bad:

```tsx
useEffect(() => {
  if (!open) {
    document
      .querySelector(".last-image")
      ?.focus();
  }
}, [open]);
```

if `useMediaLightbox` already provides focus restoration.

Prefer the package's existing contract.

---

# 13. Escape handling

Do not add a second global `keydown` listener in the app if the Lightbox hook already handles Escape.

Avoid:

```tsx
useEffect(() => {
  window.addEventListener(
    "keydown",
    handleEscape,
  );
}, []);
```

when:

```tsx
useMediaLightbox(...)
```

already provides Escape behavior.

Duplicating keyboard behavior can result in:

* duplicate callbacks
* stale closures
* incorrect cleanup
* focus bugs

Use the headless component's behavior.

---

# 14. Consumer-controlled media rendering

The Lightbox should not know how a media item is rendered.

The application decides:

```tsx
{item.type === "video" ? (
  <video
    src={item.videoUrl}
    controls
  />
) : (
  <img
    src={item.previewUrl}
    alt={item.title ?? ""}
  />
)}
```

The Lightbox only manages the surrounding interaction model.

This preserves the headless boundary.

---

# 15. Reel Swiper

The Reel Swiper provides:

* vertical paging behavior
* active-item detection
* navigation behavior exposed by the hook
* relevant accessibility/interaction state

The application supplies:

* scroll container
* reel markup
* video/image elements
* CSS
* controls
* captions
* overlays

Example:

```tsx
const reels =
  useMediaReelSwiper({
    items,
    onActiveChange,
  });
```

Then:

```tsx
<div
  {...reels.getContainerProps()}
  className="reels"
>
  {items.map((item, index) => (
    <article
      key={item.id}
      {...reels.getItemProps(
        item,
        index,
      )}
      className="reel"
    >
      ...
    </article>
  ))}
</div>
```

---

# 16. Reel vertical snap belongs to the consumer layout

The Reel Swiper must support vertical snap paging, but the headless package should not ship CSS.

The application can provide:

```css
.reels {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.reel {
  height: 100vh;
  scroll-snap-align: start;
}
```

The hook can observe which item is active.

The package must not require a particular visual implementation.

---

# 17. Active-item detection

Use the hook's `activeIndex` / `activeItem` contract rather than recreating active-item calculation in the app.

Example:

```tsx
const {
  activeIndex,
  activeItem,
} = useMediaReelSwiper({
  items,
  onActiveChange(item, index) {
    console.log(
      "Active reel",
      item.id,
      index,
    );
  },
});
```

Do not implement a second competing `scroll` listener in the application unless the existing API genuinely cannot support the required behavior.

The point of the hook is to centralize reusable interaction behavior.

---

# 18. Reel callbacks remain application callbacks

The UI package should expose:

```tsx
onActiveChange
```

but should not decide what an active item means for the SDK.

For example:

```tsx
useMediaReelSwiper({
  items,
  onActiveChange(item) {
    // application decides what to do
  },
});
```

The application may decide to:

* autoplay the active video
* pause the previous video
* track a view event
* update application state
* update the URL

The headless package must not import `media-react` to do these things.

---

# 19. Styling must remain outside the package

Before adding CSS to `media-ui-react`, stop.

Ask:

> Is this required for behavior, or is it presentation?

If it is presentation, it belongs to the consumer.

Do not add:

```text
styles.css
theme.css
tokens.css
default-theme.css
```

to make the component "look complete."

A visually unstyled headless component is expected.

---

# 20. Accessibility rules

When consuming the headless package:

### Preserve generated semantics

If a getter provides:

```tsx
aria-label
aria-current
role
tabIndex
```

do not remove them without understanding why.

### Use meaningful labels

For example:

```tsx
<button
  aria-label={`Open ${item.title}`}
>
```

is preferable to an unlabeled image-only control.

### Images need useful alt text

Use:

```tsx
<img
  alt={item.title ?? "Media"}
/>
```

Do not use:

```tsx
<img alt="" />
```

for an interactive media item unless the surrounding control already provides the complete accessible name.

### Dialogs need an accessible name

The consumer should provide:

```tsx
<section
  {...lightbox.getDialogProps()}
  aria-label="Media preview"
>
```

or an appropriate labelled-by relationship.

### Keyboard operation must work

Test:

```text
Tab
Shift+Tab
Enter
Space
Escape
Arrow keys
```

where applicable to the component.

---

# 21. Do not duplicate accessibility behavior

If the hook already provides:

```text
Escape
focus trapping
focus restoration
keyboard navigation
aria attributes
```

do not implement a second version in the consuming application.

The application should compose with the behavior.

It should not fight it.

---

# 22. Ref handling

Headless hooks often need refs.

When a getter returns a ref, preserve it.

For example:

```tsx
<div
  {...grid.getGridProps()}
/>
```

If the application needs its own ref, compose the refs instead of overwriting the one from the hook.

Do not do:

```tsx
<div
  {...grid.getGridProps()}
  ref={myRef}
/>
```

if `getGridProps()` already provides a required ref.

That can silently break behavior such as:

* intersection observation
* focus management
* measurement
* load-more detection

---

# 23. Keep the markup flexible

Do not assume one semantic structure is universally correct.

For example, a Grid consumer may choose:

```tsx
<ul>
  <li>...</li>
</ul>
```

instead of:

```tsx
<div>
  <article>...</article>
</div>
```

The headless API should support the consumer's semantic markup wherever possible.

If the hook's behavior requires a specific semantic role, preserve that requirement.

---

# 24. Do not create styled wrappers around headless hooks

Avoid:

```tsx
export function StyledMediaGrid() {
  return (
    <MediaGrid className="default-grid" />
  );
}
```

inside `media-ui-react`.

The package should expose behavior.

The application can create its own opinionated component:

```tsx
function GalleryGrid(props) {
  const grid =
    useMediaGrid(props);

  return (
    <div
      {...grid.getGridProps()}
      className="gallery-grid"
    >
      ...
    </div>
  );
}
```

This is the correct place for application-specific visual design.

---

# 25. Do not couple the UI package to Pexels

Never write:

```tsx
if (item.type === "pexels-photo") {
  ...
}
```

or:

```tsx
import {
  PexelsPhoto,
} from "media-core";
```

The UI API should work with generic item types.

Example:

```tsx
interface MediaLikeItem {
  id: string;
}
```

The consumer may provide additional fields.

---

# 26. Do not couple the UI package to media-react

Never write:

```tsx
import {
  useMediaSearch,
} from "media-react";
```

inside `media-ui-react`.

Never write:

```tsx
const {
  data,
} = useMediaSearch(...);
```

inside a Grid, Lightbox, or Reel hook.

Instead:

```tsx
const grid =
  useMediaGrid({
    items,
  });
```

The application obtains `items`.

---

# 27. Canonical composition pattern

The preferred application architecture is:

```tsx
function Gallery() {
  const {
    data,
  } = useMediaSearch({
    query,
  });

  const items =
    data?.items ?? [];

  const grid =
    useMediaGrid({
      items,
      onItemSelect: handleSelect,
    });

  return (
    <div
      {...grid.getGridProps()}
      className="gallery"
    >
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

This is the canonical composition pattern for this repository.

---

# 28. Bad implementation patterns

### ❌ Fetching from a UI hook

```tsx
function useMediaGrid() {
  const {
    data,
  } = useMediaSearch();

  ...
}
```

Why:

```text
media-ui-react → media-react
```

This violates the dependency boundary.

---

### ❌ SDK-specific component

```tsx
function PexelsGrid() {
  ...
}
```

inside `media-ui-react`.

Why:

The component library must not know which provider produced the data.

---

### ❌ Baked-in styles

```tsx
return (
  <div
    style={{
      display: "grid",
      gap: 16,
    }}
  >
```

Why:

The component is no longer genuinely headless.

---

### ❌ Hidden markup

```tsx
function useMediaGrid() {
  return <div>...</div>;
}
```

Why:

Hooks should provide behavior, not render the consumer's UI.

---

### ❌ Duplicate focus management

```tsx
useEffect(() => {
  document.body.focus();
}, [open]);
```

Why:

This can conflict with the Lightbox's focus-management contract.

---

### ❌ Duplicate active-item calculation

```tsx
window.addEventListener(
  "scroll",
  calculateActiveItem,
);
```

inside the app when the Reel hook already provides active-item detection.

Why:

Two competing sources of truth.

---

# 29. When modifying existing UI usage

Before changing a component integration:

1. Read the actual `media-ui-react` public exports.
2. Inspect the hook's TypeScript signature.
3. Inspect every prop-getter returned by the hook.
4. Preserve returned refs and event handlers.
5. Keep markup in the consumer.
6. Keep CSS in the consumer.
7. Keep SDK/data access in the application.
8. Reuse existing accessibility behavior.
9. Do not invent a new component abstraction unless necessary.

If an expected getter or behavior is missing, do not bypass the package boundary.

Report the missing capability and propose the smallest public API change.

---

# 30. Validation checklist

Before considering a UI integration complete:

### Headless

* [ ] No component package CSS was required.
* [ ] Consumer owns the DOM structure.
* [ ] Consumer owns styling.
* [ ] Consumer chooses media rendering.
* [ ] Hooks provide behavior through state and prop-getters.

### Grid

* [ ] Items are supplied by the application.
* [ ] Grid doesn't fetch data.
* [ ] Item selection is exposed through callbacks.
* [ ] Load-more/infinite-scroll behavior is exposed through callbacks.
* [ ] Consumer controls layout.

### Lightbox

* [ ] Consumer controls dialog markup.
* [ ] Escape closes the Lightbox.
* [ ] Keyboard navigation works.
* [ ] Focus moves appropriately when opened.
* [ ] Focus is restored when closed.
* [ ] Dialog has an accessible name.
* [ ] No duplicate focus-management system exists.

### Reel Swiper

* [ ] Items are supplied by the application.
* [ ] Vertical paging works.
* [ ] Consumer controls snap CSS/layout.
* [ ] Active item is exposed by the hook.
* [ ] `onActiveChange` works.
* [ ] UI package does not fetch videos.
* [ ] UI package does not track SDK events.

### Dependency boundary

* [ ] `media-ui-react` imports neither `media-core` nor `media-react`.
* [ ] Application composes `media-react` and `media-ui-react`.
* [ ] UI components work with mock/plain data.
* [ ] No Pexels-specific logic exists in the UI package.

---

# 31. Decision rule

When implementing a new feature, ask:

> "Does this determine how the interface behaves, or how the interface looks?"

If it determines behavior:

```text
media-ui-react
```

If it determines appearance:

```text
application
```

If it retrieves/transforms SDK data:

```text
media-react / application
```

If it is Pexels/API implementation:

```text
media-core
```

If it combines SDK data with headless behavior:

```text
application
```

Never move presentation downward just because it makes a component easier to use.

---

# 32. Expected architecture

The final web application should conceptually look like:

```text
                    WEB APP
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
    media-react               media-ui-react
          │                         │
          ▼                         ▼
      MediaItem[]             UI behavior
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
              consumer markup
                    + CSS
```

The application owns the composition.

`media-ui-react` owns reusable interaction behavior.

`media-react` owns React access to SDK data/events.

Neither package should leak into the other.

---

## 33. Final rule for AI agents

When asked to build a UI feature using `media-ui-react`:

1. Inspect the existing hook/API first.
2. Use the existing prop-getters.
3. Keep markup in the application.
4. Keep styling in the application.
5. Keep media rendering in the application.
6. Preserve refs, event handlers, and accessibility props returned by the hooks.
7. Do not fetch data from the UI package.
8. Do not import `media-react` or `media-core`.
9. Do not add default styles.
10. Do not duplicate behavior already provided by the headless hook.
11. If the public API cannot support the requested behavior, propose the smallest API addition instead of bypassing the architecture.

The goal is not to make `media-ui-react` look finished by itself.

The goal is to make it provide **portable, reusable UI behavior that any consumer can render and style differently**.
# Media UI Usage Skill

*Placeholder: Final content to be added in subsequent phases.*
