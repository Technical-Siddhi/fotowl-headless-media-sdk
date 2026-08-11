import React, { useState } from 'react';
import { useCuratedMedia, useMediaSearch, useMediaSDK } from '@fotowl/media-react';
import type { MediaAsset } from '@fotowl/media-react';
import {
  MediaCard,
  MediaError,
  MediaGrid,
  MediaLoading,
  MediaModal,
  MediaPagination,
  MediaReel,
  MediaSearch,
  useMediaUI,
} from '@fotowl/media-ui-react';

export const MediaBrowser: React.FC = () => {
  const [mode, setMode] = useState<'search' | 'curated' | 'reel'>('search');
  const [searchQuery, setSearchQuery] = useState('nature');
  const [searchInput, setSearchInput] = useState('nature');
  const [searchPage, setSearchPage] = useState(1);
  const [curatedPage, setCuratedPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const sdk = useMediaSDK();
  const { selectedAsset, isModalOpen, openAsset, closeAsset } = useMediaUI();

  // Search data wiring in demo-web layer
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useMediaSearch(mode === 'search' ? { query: searchQuery, page: searchPage, perPage: 12 } : null);

  // Curated media wiring in demo-web layer
  const {
    data: curatedData,
    isLoading: isCuratedLoading,
    error: curatedError,
    refetch: refetchCurated,
  } = useCuratedMedia(mode === 'curated' || mode === 'reel' ? { page: curatedPage, perPage: 12 } : null);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      setSearchPage(1);
    }
  };

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
        <button
          id="tab-reel"
          type="button"
          role="tab"
          aria-selected={mode === 'reel'}
          aria-controls="panel-reel"
          className={`tab-btn ${mode === 'reel' ? 'active' : ''}`}
          onClick={() => setMode('reel')}
        >
          Video Reel / Swiper
        </button>
      </div>

      {/* Search Mode Panel */}
      {mode === 'search' && (
        <div id="panel-search" role="tabpanel" aria-labelledby="tab-search">
          <MediaSearch
            value={searchInput}
            onChange={(val) => setSearchInput(val)}
            onSubmit={handleSearchSubmit}
            query={searchQuery}
            assets={searchData?.assets || []}
            isLoading={isSearchLoading}
            error={searchError}
            page={searchPage}
            hasNext={searchData?.pagination?.hasNext}
            hasPrev={searchPage > 1}
            onPageChange={(p) => setSearchPage(p)}
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

      {/* Reel Swiper Mode Panel */}
      {mode === 'reel' && (
        <div id="panel-reel" role="tabpanel" aria-labelledby="tab-reel" className="reel-container" style={{ height: '600px' }}>
          {isCuratedLoading && <MediaLoading message="Loading reel items..." />}
          {curatedError && <MediaError error={curatedError} onRetry={refetchCurated} />}

          {!isCuratedLoading && !curatedError && curatedData && (
            <MediaReel
              assets={curatedData.assets}
              onActiveChange={(asset) => sdk.trackView(asset)}
              onSelectAsset={handleSelectAsset}
              onDownloadAsset={handleDownloadAsset}
              renderItem={(asset) => renderMediaCard(asset)}
              hasMore={curatedData.pagination?.hasNext}
              onLoadMore={() => setCuratedPage((prev) => prev + 1)}
            />
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
