import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { MediaAsset } from '@fotowl/media-core';
import { MediaCard } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '101',
  type: 'photo',
  title: 'Test Landscape',
  url: 'https://example.com/101',
  previewUrl: 'https://example.com/101/preview.jpg',
  downloadUrl: 'https://example.com/101/download.jpg',
  width: 1920,
  height: 1080,
  author: { name: 'Alice', url: 'https://example.com/alice' },
  src: {
    original: 'https://example.com/101/download.jpg',
    large: 'https://example.com/101/large.jpg',
    medium: 'https://example.com/101/preview.jpg',
    small: 'https://example.com/101/small.jpg',
    tiny: 'https://example.com/101/tiny.jpg',
  },
};

describe('MediaCard Component', () => {
  it('renders asset image with accessible alt text and author info', () => {
    render(<MediaCard asset={mockAsset} />);

    const img = screen.getByRole('img');
    expect(img.getAttribute('alt')).toBe('Test Landscape');
    expect(screen.getByText('Test Landscape')).not.toBeNull();
    expect(screen.getByText('Alice')).not.toBeNull();
  });

  it('triggers onSelect when card is clicked', () => {
    const onSelect = vi.fn();
    render(<MediaCard asset={mockAsset} onSelect={onSelect} />);

    const article = screen.getByRole('article');
    fireEvent.click(article);

    expect(onSelect).toHaveBeenCalledWith(mockAsset);
  });

  it('triggers onSelect when Enter or Space key is pressed', () => {
    const onSelect = vi.fn();
    render(<MediaCard asset={mockAsset} onSelect={onSelect} />);

    const article = screen.getByRole('article');
    fireEvent.keyDown(article, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(article, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('renders download button and triggers onDownload when clicked', () => {
    const onDownload = vi.fn();
    render(<MediaCard asset={mockAsset} onDownload={onDownload} />);

    const downloadBtn = screen.getByRole('button', { name: /download test landscape/i });
    fireEvent.click(downloadBtn);

    expect(onDownload).toHaveBeenCalledWith(mockAsset);
  });
});
