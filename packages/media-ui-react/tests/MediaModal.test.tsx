import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { MediaAsset } from '@fotowl/media-core';
import { MediaModal } from '../src/index.js';

const mockAsset: MediaAsset = {
  id: '777',
  type: 'photo',
  title: 'Modal Image Title',
  url: 'https://example.com/777',
  previewUrl: 'https://example.com/777.jpg',
  downloadUrl: 'https://example.com/777/full.jpg',
  width: 1920,
  height: 1080,
  author: { name: 'Bob', url: 'https://example.com/bob' },
  src: { original: '777.jpg', large: '777.jpg', medium: '777.jpg', small: '777.jpg', tiny: '777.jpg' },
};

describe('MediaModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(<MediaModal isOpen={false} asset={mockAsset} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders modal dialog with accessible attributes when isOpen is true', () => {
    render(<MediaModal isOpen={true} asset={mockAsset} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('media-modal-title');
    expect(screen.getByText('Modal Image Title')).not.toBeNull();
    expect(screen.getByText(/1920 × 1080/i)).not.toBeNull();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<MediaModal isOpen={true} asset={mockAsset} onClose={onClose} />);

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<MediaModal isOpen={true} asset={mockAsset} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('restores focus to previous active element when modal closes', async () => {
    const TestComponent = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div>
          <button id="trigger-btn" onClick={() => setIsOpen(true)}>
            Open Modal
          </button>
          <MediaModal isOpen={isOpen} asset={mockAsset} onClose={() => setIsOpen(false)} />
        </div>
      );
    };

    render(<TestComponent />);
    const triggerBtn = screen.getByRole('button', { name: /open modal/i });

    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    fireEvent.click(triggerBtn);
    expect(screen.getByRole('dialog')).not.toBeNull();

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(document.activeElement).toBe(triggerBtn);
  });
});
