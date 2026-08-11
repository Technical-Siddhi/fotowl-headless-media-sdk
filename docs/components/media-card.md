# MediaCard

`MediaCard` displays a single `MediaAsset` with preview image, title, author details, download button, and optional extra actions slot.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `asset` | `MediaAsset` | **Required** | The normalized media asset model. |
| `onSelect` | `(asset: MediaAsset) => void` | `undefined` | Fired when card is clicked or activated with Enter/Space. |
| `onDownload` | `(asset: MediaAsset) => void` | `undefined` | Fired when the download button is clicked. |
| `extraActions` | `React.ReactNode` | `undefined` | Optional slot for custom action buttons (e.g. Favorite button). |
| `className` | `string` | `''` | Custom CSS class. |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles. |

## Accessibility

- `tabIndex={0}` when `onSelect` is provided.
- Responds to `Enter` and `Space` keyboard keypresses.
- Image includes accessible `alt` text.

## Usage Example

```tsx
import { MediaCard } from '@fotowl/media-ui-react';

<MediaCard
  asset={asset}
  onSelect={(asset) => console.log('Selected:', asset)}
  onDownload={(asset) => console.log('Download:', asset)}
  extraActions={<button type="button">Favorite</button>}
/>
```
