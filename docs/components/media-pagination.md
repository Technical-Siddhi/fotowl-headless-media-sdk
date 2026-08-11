# MediaPagination

`MediaPagination` renders accessible page controls (`Previous` and `Next` buttons) driven by pagination state.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | **Required** | Current active page number. |
| `onPageChange` | `(page: number) => void` | **Required** | Callback fired when user changes page. |
| `totalPages` | `number` | `undefined` | Total available pages (optional). |
| `hasNext` | `boolean` | `true` | Enables/disables Next page button. |
| `hasPrev` | `boolean` | `true` | Enables/disables Previous page button. |
| `className` | `string` | `''` | Custom CSS class. |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles. |

## Usage Example

```tsx
import { MediaPagination } from '@fotowl/media-ui-react';

<MediaPagination
  page={currentPage}
  hasNext={true}
  hasPrev={currentPage > 1}
  onPageChange={(newPage) => setPage(newPage)}
/>
```
