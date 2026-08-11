import React from 'react';
import type { MediaGridProps } from '../types/index.js';
import { MediaCard } from './MediaCard.js';

export const MediaGrid: React.FC<MediaGridProps> = ({
  assets,
  onSelectAsset,
  onDownloadAsset,
  renderItem,
  emptyState = <p className="media-grid-empty">No media items found.</p>,
  hasMore = false,
  loading = false,
  onLoadMore,
  className = '',
  style,
}) => {
  if (!assets || assets.length === 0) {
    return <div className={`media-grid-empty-wrapper ${className}`.trim()}>{emptyState}</div>;
  }

  return (
    <div
      role="region"
      aria-label="Media gallery"
      className={`media-grid-container ${className}`.trim()}
      style={style}
    >
      <div className="media-grid">
        {assets.map((asset) => (
          <div key={asset.id} className="media-grid-item">
            {renderItem ? (
              renderItem(asset)
            ) : (
              <MediaCard
                asset={asset}
                onSelect={onSelectAsset}
                onDownload={onDownloadAsset}
              />
            )}
          </div>
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="media-grid-load-more">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="media-load-more-btn"
            aria-label="Load more items"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};
