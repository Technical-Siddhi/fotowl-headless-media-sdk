# MediaSearch

`MediaSearch` combines a search input bar, debounced search execution via `useMediaSearch`, media grid layout, loading indicators, error alerts, and pagination controls.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialQuery` | `string` | `'nature'` | Default search query on component mount. |
| `perPage` | `number` | `12` | Number of items requested per page. |
| `onSelectAsset` | `(asset: MediaAsset) => void` | `undefined` | Callback fired when an asset card is selected. |
| `onDownloadAsset` | `(asset: MediaAsset) => void` | `undefined` | Callback fired when download action is triggered. |
| `renderItem` | `(asset: MediaAsset) => React.ReactNode` | `undefined` | Custom item renderer callback. |
| `emptyState` | `React.ReactNode` | `undefined` | Node displayed when search yields 0 results. |
| `loadingState` | `React.ReactNode` | `undefined` | Custom node rendered while loading. |
| `errorState` | `React.ReactNode` | `undefined` | Custom node rendered on error. |
| `className` | `string` | `''` | Custom CSS class. |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles. |

## Usage Example

```tsx
import { MediaSearch } from '@fotowl/media-ui-react';

<MediaSearch
  initialQuery="nature"
  perPage={12}
  onSelectAsset={(asset) => openModal(asset)}
  onDownloadAsset={(asset) => downloadAsset(asset)}
/>
```
