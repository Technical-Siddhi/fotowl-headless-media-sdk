import React from 'react';
import type { MediaPaginationProps } from '../types/index.js';

export const MediaPagination: React.FC<MediaPaginationProps> = ({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  className = '',
  style,
}) => {
  const canGoPrev = hasPrev !== undefined ? hasPrev : page > 1;
  const canGoNext = hasNext !== undefined ? hasNext : (totalPages !== undefined ? page < totalPages : true);

  return (
    <nav
      aria-label="Media pagination"
      className={`media-pagination ${className}`.trim()}
      style={style}
    >
      <button
        type="button"
        disabled={!canGoPrev}
        onClick={() => canGoPrev && onPageChange(page - 1)}
        aria-label="Previous page"
        className="media-pagination-prev"
      >
        Previous
      </button>
      <span className="media-pagination-info" aria-current="page">
        Page {page} {totalPages ? `of ${totalPages}` : ''}
      </span>
      <button
        type="button"
        disabled={!canGoNext}
        onClick={() => canGoNext && onPageChange(page + 1)}
        aria-label="Next page"
        className="media-pagination-next"
      >
        Next
      </button>
    </nav>
  );
};
