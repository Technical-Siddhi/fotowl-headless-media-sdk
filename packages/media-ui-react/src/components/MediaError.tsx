import React from 'react';
import type { MediaErrorProps } from '../types/index.js';

function getSafeErrorMessage(error: Error | null): string {
  if (!error) return 'An unexpected error occurred.';
  const msg = error.message || 'An error occurred while loading media.';
  return msg.replace(/(key|token|auth)=[\w-]+/gi, '$1=***');
}

export const MediaError: React.FC<MediaErrorProps> = ({
  error,
  onRetry,
  className = '',
  style,
}) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      className={`media-error ${className}`.trim()}
      style={style}
    >
      <p>{getSafeErrorMessage(error)}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} aria-label="Retry media request">
          Retry
        </button>
      )}
    </div>
  );
};
