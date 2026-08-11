import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { MediaAsset } from '../src/index.js';
import { MediaSearch } from '../src/index.js';

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
  it('renders search input and triggers onSubmit on form submit', () => {
    const onSubmit = vi.fn();
    render(<MediaSearch value="forest" onSubmit={onSubmit} />);

    const input = screen.getByLabelText(/search media input/i) as HTMLInputElement;
    const submitBtn = screen.getByRole('button', { name: /submit search/i });

    expect(input.value).toBe('forest');
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith('forest');
  });

  it('renders loading indicator when isLoading is true', () => {
    render(<MediaSearch query="ocean" isLoading={true} />);

    const status = screen.getByRole('status');
    expect(status.textContent).toContain('Searching for "ocean"...');
  });

  it('renders error component when search error occurs', () => {
    render(<MediaSearch query="ocean" error={new Error('Rate limit exceeded')} />);

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Rate limit exceeded');
  });

  it('renders results grid and integrates pagination control', () => {
    const onPageChange = vi.fn();

    render(
      <MediaSearch
        query="forest"
        assets={[mockAsset]}
        page={1}
        hasNext={true}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByText('Search Result Item')).not.toBeNull();
    const nextBtn = screen.getByRole('button', { name: /next page/i }) as HTMLButtonElement;
    expect(nextBtn.disabled).toBe(false);

    fireEvent.click(nextBtn);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
