import React, { useState } from 'react';
import { useCuratedMedia, useMediaSDK } from '@fotowl/media-react';
import type { MediaAsset } from '@fotowl/media-react';
import {
  MediaCard,
  MediaError,
  MediaGrid,
  MediaLoading,
  MediaModal,
  MediaPagination,
  MediaSearch,
  useMediaUI,
} from '@fotowl/media-ui-react';

export const MediaBrowser: React.FC = () => {
  const [mode, setMode] = useState<'search' | 'curated'>('search');
  const [curatedPage, setCuratedPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const sdk = useMediaSDK();
  const { selectedAsset, isModalOpen, openAsset, closeAsset } = useMediaUI();

  // Curated media hook (active when mode === 'curated')
  const {
    data: curatedData,
    isLoading: isCuratedLoading,
    error: curatedError,
    refetch: refetchCurated,
  } = useCuratedMedia(mode === 'curated' ? { page: curatedPage, perPage: 12 } : null);

  const handleSelectAsset = (asset: MediaAsset) => {
    sdk.trackView(asset);
    openAsset(asset);
  };

  const handleDownloadAsset = (asset: MediaAsset) => {
    sdk.trackDownload(asset);
    if (asset.downloadUrl) {
      window.open(asset.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleFavorite = (assetId: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) {
        next.delete(assetId);
      } else {
        next.add(assetId);
      }
      return next;
    });
  };

  const renderMediaCard = (asset: MediaAsset) => {
    const isFav = favoriteIds.has(asset.id);
    return (
      <MediaCard
        asset={asset}
        onSelect={handleSelectAsset}
        onDownload={handleDownloadAsset}
        extraActions={
          <button
            type="button"
            className={`media-card-favorite-btn ${isFav ? 'favorited' : ''}`}
            onClick={(e) => handleToggleFavorite(asset.id, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
              }
            }}
            aria-label={
              isFav
                ? `Remove ${asset.title || 'media asset'} from favorites`
                : `Add ${asset.title || 'media asset'} to favorites`
            }
            aria-pressed={isFav}
          >
            {isFav ? '★ Favorited' : '☆ Favorite'}
          </button>
        }
      />
    );
  };

  return (
    <div className="media-browser-container">
      {/* Mode Switcher Tabs */}
      <div className="mode-tabs" role="tablist" aria-label="Media browsing mode">
        <button
          id="tab-search"
          type="button"
          role="tab"
          aria-selected={mode === 'search'}
          aria-controls="panel-search"
          className={`tab-btn ${mode === 'search' ? 'active' : ''}`}
          onClick={() => setMode('search')}
        >
          Search Catalog
        </button>
        <button
          id="tab-curated"
          type="button"
          role="tab"
          aria-selected={mode === 'curated'}
          aria-controls="panel-curated"
          className={`tab-btn ${mode === 'curated' ? 'active' : ''}`}
          onClick={() => setMode('curated')}
        >
          Curated Showcase
        </button>
      </div>

      {/* Search Mode Panel */}
      {mode === 'search' && (
        <div id="panel-search" role="tabpanel" aria-labelledby="tab-search">
          <MediaSearch
            initialQuery="nature"
            perPage={12}
            onSelectAsset={handleSelectAsset}
            onDownloadAsset={handleDownloadAsset}
            renderItem={renderMediaCard}
          />
        </div>
      )}

      {/* Curated Mode Panel */}
      {mode === 'curated' && (
        <div id="panel-curated" role="tabpanel" aria-labelledby="tab-curated" className="curated-container">
          {isCuratedLoading && <MediaLoading message="Fetching curated photos..." />}

          {curatedError && <MediaError error={curatedError} onRetry={refetchCurated} />}

          {!isCuratedLoading && !curatedError && curatedData && (
            <>
              <MediaGrid
                assets={curatedData.assets}
                onSelectAsset={handleSelectAsset}
                onDownloadAsset={handleDownloadAsset}
                renderItem={renderMediaCard}
              />

              {curatedData.pagination && (curatedData.pagination.hasNext || curatedPage > 1) && (
                <MediaPagination
                  page={curatedPage}
                  hasNext={curatedData.pagination.hasNext}
                  hasPrev={curatedPage > 1}
                  onPageChange={(p) => setCuratedPage(p)}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Asset Details Modal */}
      <MediaModal
        isOpen={isModalOpen}
        asset={selectedAsset}
        onClose={closeAsset}
        onDownload={handleDownloadAsset}
      />
    </div>
  );
};
