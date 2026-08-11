import React, { useRef, useState } from 'react';
import type { MediaReelProps } from '../types/index.js';
import { MediaCard } from './MediaCard.js';

export const MediaReel: React.FC<MediaReelProps> = ({
  assets = [],
  activeIndex: controlledActiveIndex,
  onActiveChange,
  onSelectAsset,
  onDownloadAsset,
  renderItem,
  emptyState = <p className="media-reel-empty">No reel items found.</p>,
  hasMore = false,
  loading = false,
  onLoadMore,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);

  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const itemHeight = container.clientHeight;
    if (itemHeight <= 0) return;

    const newIndex = Math.round(container.scrollTop / itemHeight);
    if (newIndex >= 0 && newIndex < assets.length && newIndex !== activeIndex) {
      setInternalActiveIndex(newIndex);
      if (onActiveChange && assets[newIndex]) {
        onActiveChange(assets[newIndex], newIndex);
      }
    }

    if (hasMore && onLoadMore && !loading) {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
        onLoadMore();
      }
    }
  };

  if (!assets || assets.length === 0) {
    return <div className={`media-reel-empty-wrapper ${className}`.trim()}>{emptyState}</div>;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      role="region"
      aria-label="Media reel swiper"
      className={`media-reel-container ${className}`.trim()}
      style={{
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      {assets.map((asset, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={asset.id || index}
            className={`media-reel-item ${isActive ? 'active' : ''}`.trim()}
            style={{
              scrollSnapAlign: 'start',
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {renderItem ? (
              renderItem(asset, isActive, index)
            ) : (
              <MediaCard
                asset={asset}
                onSelect={onSelectAsset}
                onDownload={onDownloadAsset}
              />
            )}
          </div>
        );
      })}

      {hasMore && onLoadMore && (
        <div className="media-reel-load-more" style={{ scrollSnapAlign: 'end', padding: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="media-load-more-btn"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};
