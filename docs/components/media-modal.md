# MediaModal

`MediaModal` is an accessible dialog overlay for displaying detailed asset information, photographer links, full-resolution previews, and download actions.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | **Required** | Controls visibility of the modal dialog. |
| `asset` | `MediaAsset \| null` | `null` | Asset model to display. |
| `onClose` | `() => void` | **Required** | Callback fired when overlay, close button, or Escape key is activated. |
| `onDownload` | `(asset: MediaAsset) => void` | `undefined` | Callback fired when download button inside modal is clicked. |
| `className` | `string` | `''` | Custom CSS class. |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles. |

## Accessibility Features

- Features `role="dialog"` and `aria-modal="true"`.
- Focus is trapped inside the dialog when active.
- Keyboard `Escape` key closes the dialog.
- Focus returns to the previously active trigger element when closed.

## Usage Example

```tsx
import { MediaModal, useMediaUI } from '@fotowl/media-ui-react';

function Gallery() {
  const { selectedAsset, isModalOpen, closeAsset } = useMediaUI();

  return (
    <MediaModal
      isOpen={isModalOpen}
      asset={selectedAsset}
      onClose={closeAsset}
    />
  );
}
```
