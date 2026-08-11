import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { MediaAsset } from '../src/index.js';
import { MediaReel } from '../src/index.js';

const mockAssets: MediaAsset[] = [
  {
    id: 'r1',
    type: 'video',
    title: 'Reel Video 1',
    url: 'https://example.com/r1',
    previewUrl: 'https://example.com/r1.jpg',
    width: 1080,
    height: 1920,
  },
  {
    id: 'r2',
    type: 'video',
    title: 'Reel Video 2',
    url: 'https://example.com/r2',
    previewUrl: 'https://example.com/r2.jpg',
    width: 1080,
    height: 1920,
  },
];

describe('MediaReel Component', () => {
  it('renders reel items and empty state when empty', () => {
    render(<MediaReel assets={mockAssets} />);
    expect(screen.getByText('Reel Video 1')).not.toBeNull();
    expect(screen.getByText('Reel Video 2')).not.toBeNull();
  });

  it('renders custom emptyState when assets list is empty', () => {
    render(<MediaReel assets={[]} emptyState={<div>No videos found</div>} />);
    expect(screen.getByText('No videos found')).not.toBeNull();
  });

  it('renders load more button when hasMore is true', () => {
    const onLoadMore = vi.fn();
    render(<MediaReel assets={mockAssets} hasMore={true} onLoadMore={onLoadMore} />);
    const loadBtn = screen.getByRole('button', { name: /load more/i });
    expect(loadBtn).not.toBeNull();
  });
});
