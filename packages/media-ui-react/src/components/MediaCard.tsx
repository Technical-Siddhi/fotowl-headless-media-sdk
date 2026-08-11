import React from 'react';
import type { MediaCardProps } from '../types/index.js';

export const MediaCard: React.FC<MediaCardProps> = ({
  asset,
  onSelect,
  onDownload,
  extraActions,
  className = '',
  style,
}) => {
  const handleClick = () => {
    onSelect?.(asset);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(asset);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(asset);
  };

  const hasActions = Boolean(extraActions || (onDownload && asset.downloadUrl));

  return (
    <article
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? handleClick : undefined}
      onKeyDown={onSelect ? handleKeyDown : undefined}
      className={`media-card ${className}`.trim()}
      style={{ cursor: onSelect ? 'pointer' : 'default', ...style }}
      aria-label={asset.title || 'Media asset'}
    >
      <div className="media-card-image-wrapper">
        <img
          src={asset.previewUrl || asset.url}
          alt={asset.title || 'Media preview'}
          loading="lazy"
          width={asset.width}
          height={asset.height}
        />
      </div>
      <div className="media-card-content">
        <h4 className="media-card-title">{asset.title || 'Untitled'}</h4>
        {asset.author && (
          <p className="media-card-author">
            By{' '}
            {asset.author.url ? (
              <a
                href={asset.author.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {asset.author.name}
              </a>
            ) : (
              <span>{asset.author.name}</span>
            )}
          </p>
        )}
      </div>
      {hasActions && (
        <div className="media-card-actions">
          {extraActions}
          {onDownload && asset.downloadUrl && (
            <button
              type="button"
              className="media-card-download-btn"
              onClick={handleDownloadClick}
              aria-label={`Download ${asset.title || 'media asset'}`}
            >
              Download
            </button>
          )}
        </div>
      )}
    </article>
  );
};
