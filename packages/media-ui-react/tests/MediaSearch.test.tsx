import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { MediaAsset } from '@fotowl/media-core';
import * as MediaReact from '@fotowl/media-react';
import { MediaSearch } from '../src/index.js';

vi.mock('@fotowl/media-react', async () => {
  const actual = await vi.importActual('@fotowl/media-react');
  return {
    ...actual,
    useMediaSearch: vi.fn(),
  };
});

const mockAsset: MediaAsset = {
  id: '888',
  type: 'photo',
  title: 'Search Result Item',
  url: 'https://example.com/888',
  previewUrl: 'https://example.com/888.jpg',
  width: 1000,
  height: 800,
  src: { original: '888.jpg', large: '888.jpg', medium: '888.jpg', small: '888.jpg', tiny: '888.jpg' },
};

describe('MediaSearch Component', () => {
  it('renders search input and triggers search on form submit', () => {
    vi.mocked(MediaReact.useMediaSearch).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MediaSearch initialQuery="" />);

    const input = screen.getByLabelText(/search media input/i);
    const submitBtn = screen.getByRole('button', { name: /submit search/i });

    fireEvent.change(input, { target: { value: 'forest' } });
    fireEvent.click(submitBtn);

    expect(MediaReact.useMediaSearch).toHaveBeenCalledWith({
      query: 'forest',
      page: 1,
      perPage: 15,
    });
  });

  it('renders loading indicator when search is loading', () => {
    vi.mocked(MediaReact.useMediaSearch).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<MediaSearch initialQuery="ocean" />);

    const status = screen.getByRole('status');
    expect(status.textContent).toContain('Searching for "ocean"...');
  });

  it('renders error component when search error occurs', () => {
    vi.mocked(MediaReact.useMediaSearch).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Rate limit exceeded'),
      refetch: vi.fn(),
    });

    render(<MediaSearch initialQuery="ocean" />);

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Rate limit exceeded');
  });

  it('renders results grid and integrates pagination control', () => {
    vi.mocked(MediaReact.useMediaSearch).mockReturnValue({
      data: {
        assets: [mockAsset],
        pagination: { page: 1, perPage: 15, totalResults: 30, hasNext: true },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<MediaSearch initialQuery="forest" />);

    expect(screen.getByText('Search Result Item')).not.toBeNull();
    const nextBtn = screen.getByRole('button', { name: /next page/i }) as HTMLButtonElement;
    expect(nextBtn.disabled).toBe(false);

    fireEvent.click(nextBtn);

    expect(MediaReact.useMediaSearch).toHaveBeenLastCalledWith({
      query: 'forest',
      page: 2,
      perPage: 15,
    });
  });
});
