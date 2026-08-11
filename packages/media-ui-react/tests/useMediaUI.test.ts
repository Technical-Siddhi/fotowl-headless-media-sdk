import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { MediaAsset } from '../src/index.js';
import { useMediaUI } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '555',
  type: 'photo',
  title: 'Hook Test Asset',
  url: 'https://example.com/555',
  previewUrl: 'https://example.com/555.jpg',
  width: 500,
  height: 500,
  src: { original: '555.jpg', large: '555.jpg', medium: '555.jpg', small: '555.jpg', tiny: '555.jpg' },
};

describe('useMediaUI Hook', () => {
  it('manages modal open state and selected asset', () => {
    const { result } = renderHook(() => useMediaUI());

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.selectedAsset).toBeNull();

    act(() => {
      result.current.openAsset(mockAsset);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.selectedAsset).toBe(mockAsset);

    act(() => {
      result.current.closeAsset();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.selectedAsset).toBeNull();
  });
});
