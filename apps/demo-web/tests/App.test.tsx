import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { App } from '../src/App.js';

describe('Demo Web App', () => {
  it('renders application header, hero section, and event logger', () => {
    render(<App />);

    expect(screen.getByText('FotoOwl')).not.toBeNull();
    expect(screen.getByText('Discover Beautiful Media')).not.toBeNull();
    expect(screen.getByText('Live SDK Event Activity')).not.toBeNull();
  });

  it('allows toggling between Search Catalog and Curated Showcase', () => {
    render(<App />);

    const searchTab = screen.getByRole('tab', { name: /search catalog/i });
    const curatedTab = screen.getByRole('tab', { name: /curated showcase/i });

    expect(searchTab.getAttribute('aria-selected')).toBe('true');

    fireEvent.click(curatedTab);
    expect(curatedTab.getAttribute('aria-selected')).toBe('true');
  });
});
