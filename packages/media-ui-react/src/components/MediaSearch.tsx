import React, { useState } from 'react';
import { useMediaSearch } from '@fotowl/media-react';
import type { MediaSearchProps } from '../types/index.js';
import { MediaGrid } from './MediaGrid.js';
import { MediaPagination } from './MediaPagination.js';
import { MediaLoading } from './MediaLoading.js';
import { MediaError } from './MediaError.js';

export const MediaSearch: React.FC<MediaSearchProps> = ({
  initialQuery = '',
  perPage = 15,
  onSelectAsset,
  onDownloadAsset,
  renderItem,
  emptyState,
  loadingState,
  errorState,
  className = '',
  style,
}) => {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useMediaSearch(
    activeQuery.trim() ? { query: activeQuery, page, perPage } : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setActiveQuery(inputValue.trim());
      setPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for photos, media..."
            aria-label="Search media input"
          />
          <button type="submit" aria-label="Submit search">
            Search
          </button>
        </div>
      </form>

      {isLoading && (loadingState || <MediaLoading message={`Searching for "${activeQuery}"...`} />)}

      {error && (errorState ? errorState(error) : <MediaError error={error} onRetry={refetch} />)}

      {!isLoading && !error && data && (
        <>
          <MediaGrid
            assets={data.assets}
            onSelectAsset={onSelectAsset}
            onDownloadAsset={onDownloadAsset}
            renderItem={renderItem}
            emptyState={emptyState}
          />

          {data.pagination && (data.pagination.hasNext || page > 1) && (
            <MediaPagination
              page={page}
              hasNext={data.pagination.hasNext}
              hasPrev={page > 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
