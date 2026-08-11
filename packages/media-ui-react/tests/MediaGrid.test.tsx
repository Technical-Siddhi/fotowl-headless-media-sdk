import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { MediaAsset } from '../src/index.js';
import { MediaGrid } from '../src/index.js';

const mockAssets: MediaAsset[] = [
  {
    id: '1',
    type: 'photo',
    title: 'Asset One',
    url: 'https://example.com/1',
    previewUrl: 'https://example.com/1.jpg',
    width: 800,
    height: 600,
    src: { original: '1.jpg', large: '1.jpg', medium: '1.jpg', small: '1.jpg', tiny: '1.jpg' },
  },
  {
    id: '2',
    type: 'photo',
    title: 'Asset Two',
    url: 'https://example.com/2',
    previewUrl: 'https://example.com/2.jpg',
    width: 800,
    height: 600,
    src: { original: '2.jpg', large: '2.jpg', medium: '2.jpg', small: '2.jpg', tiny: '2.jpg' },
  },
];

describe('MediaGrid Component', () => {
  it('renders a grid of media cards', () => {
    render(<MediaGrid assets={mockAssets} />);

    expect(screen.getByText('Asset One')).not.toBeNull();
    expect(screen.getByText('Asset Two')).not.toBeNull();
  });

  it('renders emptyState when assets list is empty', () => {
    render(<MediaGrid assets={[]} emptyState={<span>Custom Empty State</span>} />);

    expect(screen.getByText('Custom Empty State')).not.toBeNull();
  });

  it('uses custom renderItem slot when provided', () => {
    render(
      <MediaGrid
        assets={mockAssets}
        renderItem={(asset) => <div data-testid="custom-item">{asset.title}</div>}
      />
    );

    const customItems = screen.getAllByTestId('custom-item');
    expect(customItems).toHaveLength(2);
    expect(customItems[0].textContent).toBe('Asset One');
  });
});
