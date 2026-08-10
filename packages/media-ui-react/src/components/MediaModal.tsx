import React, { useEffect, useRef } from 'react';
import type { MediaModalProps } from '../types/index.js';

export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  asset,
  onClose,
  onDownload,
  className = '',
  style,
}) => {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      // Move focus to close button
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    } else if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
      previousActiveElementRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !asset) return null;

  return (
    <div
      className={`media-modal-backdrop ${className}`.trim()}
      onClick={onClose}
      style={style}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-modal-title"
        className="media-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="media-modal-header">
          <h3 id="media-modal-title">{asset.title || 'Media details'}</h3>
          <button
            ref={closeButtonRef}
            type="button"
            className="media-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        <div className="media-modal-body">
          <div className="media-modal-image-wrapper">
            <img
              src={asset.downloadUrl || asset.url || asset.previewUrl}
              alt={asset.title || 'Detailed view'}
              width={asset.width}
              height={asset.height}
            />
          </div>

          <div className="media-modal-metadata">
            {asset.author && (
              <p className="media-modal-author">
                <strong>Author:</strong>{' '}
                {asset.author.url ? (
                  <a href={asset.author.url} target="_blank" rel="noopener noreferrer">
                    {asset.author.name}
                  </a>
                ) : (
                  <span>{asset.author.name}</span>
                )}
              </p>
            )}

            {asset.width && asset.height && (
              <p className="media-modal-dimensions">
                <strong>Dimensions:</strong> {asset.width} × {asset.height} px
              </p>
            )}

            <p className="media-modal-type">
              <strong>Type:</strong> {asset.type}
            </p>
          </div>
        </div>

        {onDownload && asset.downloadUrl && (
          <footer className="media-modal-footer">
            <button
              type="button"
              className="media-modal-download-btn"
              onClick={() => onDownload(asset)}
              aria-label={`Download ${asset.title || 'media asset'}`}
            >
              Download Asset
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};
