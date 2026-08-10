import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MediaPagination } from '../src/index.js';

describe('MediaPagination Component', () => {
  it('renders current page information and buttons', () => {
    render(<MediaPagination page={2} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByText('Page 2 of 5')).not.toBeNull();
    const prevBtn = screen.getByRole('button', { name: /previous page/i }) as HTMLButtonElement;
    const nextBtn = screen.getByRole('button', { name: /next page/i }) as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(false);
    expect(nextBtn.disabled).toBe(false);
  });

  it('disables previous button on first page', () => {
    render(<MediaPagination page={1} totalPages={5} onPageChange={vi.fn()} />);

    const prevBtn = screen.getByRole('button', { name: /previous page/i }) as HTMLButtonElement;
    const nextBtn = screen.getByRole('button', { name: /next page/i }) as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(false);
  });

  it('disables next button on last page', () => {
    render(<MediaPagination page={5} totalPages={5} onPageChange={vi.fn()} />);

    const nextBtn = screen.getByRole('button', { name: /next page/i }) as HTMLButtonElement;
    expect(nextBtn.disabled).toBe(true);
  });

  it('calls onPageChange with updated page number on button click', () => {
    const onPageChange = vi.fn();
    render(<MediaPagination page={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
