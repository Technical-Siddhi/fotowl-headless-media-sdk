# MediaGrid

`MediaGrid` is a layout container that maps over an array of `MediaAsset` items and renders each item using `MediaCard` or a custom `renderItem` callback.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `assets` | `MediaAsset[]` | `[]` | Array of normalized media assets to render. |
| `onSelectAsset` | `(asset: MediaAsset) => void` | `undefined` | Callback fired when an asset card is clicked or selected. |
| `onDownloadAsset` | `(asset: MediaAsset) => void` | `undefined` | Callback fired when an asset download button is clicked. |
| `renderItem` | `(asset: MediaAsset) => React.ReactNode` | `undefined` | Optional custom render callback for custom card layouts. |
| `emptyState` | `React.ReactNode` | `<p>...</p>` | Node displayed when assets array is empty. |
| `className` | `string` | `''` | Custom CSS class. |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles. |

## Usage Example

```tsx
import { MediaGrid } from '@fotowl/media-ui-react';

<MediaGrid
  assets={assets}
  onSelectAsset={(asset) => console.log('Selected:', asset)}
  onDownloadAsset={(asset) => console.log('Download:', asset)}
/>
```
