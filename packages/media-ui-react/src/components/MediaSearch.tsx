import React, { useState } from 'react';
import type { MediaSearchProps } from '../types/index.js';
import { MediaGrid } from './MediaGrid.js';
import { MediaPagination } from './MediaPagination.js';
import { MediaLoading } from './MediaLoading.js';
import { MediaError } from './MediaError.js';

export const MediaSearch: React.FC<MediaSearchProps> = ({
  value,
  onChange,
  onSubmit,
  initialQuery = '',
  query: controlledQuery,
  onSearch,
  assets = [],
  isLoading = false,
  error = null,
  page = 1,
  hasNext = false,
  hasPrev = false,
  onPageChange,
  onSelectAsset,
  onDownloadAsset,
  renderItem,
  emptyState,
  loadingState,
  errorState,
  className = '',
  style,
}) => {
  const [internalValue, setInternalValue] = useState(initialQuery);

  const inputValue = value !== undefined ? value : internalValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onChange) {
      onChange(val);
    } else {
      setInternalValue(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(inputValue);
    }
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  const activeSearchTerm = controlledQuery ?? inputValue;

  return (
    <div className={`media-search-container ${className}`.trim()} style={style}>
      <form onSubmit={handleSubmit} className="media-search-form" role="search">
        <label htmlFor="media-search-input" className="media-search-label">
          Search Media
        </label>
        <div className="media-search-input-group">
          <input
            id="media-search-input"
            type="search"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for photos, media..."
            aria-label="Search media input"
          />
          <button type="submit" aria-label="Submit search">
            Search
          </button>
        </div>
      </form>

      {isLoading && (loadingState || <MediaLoading message={`Searching for "${activeSearchTerm}"...`} />)}

      {error && (errorState ? errorState(error) : <MediaError error={error} />)}

      {!isLoading && !error && assets && assets.length > 0 && (
        <>
          <MediaGrid
            assets={assets}
            onSelectAsset={onSelectAsset}
            onDownloadAsset={onDownloadAsset}
            renderItem={renderItem}
            emptyState={emptyState}
          />

          {(hasNext || hasPrev || page > 1) && onPageChange && (
            <MediaPagination
              page={page}
              hasNext={hasNext}
              hasPrev={hasPrev || page > 1}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}

      {!isLoading && !error && assets.length === 0 && (emptyState || null)}
    </div>
  );
};
