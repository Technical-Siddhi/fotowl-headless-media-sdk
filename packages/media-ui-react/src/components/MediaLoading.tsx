import React from 'react';
import type { MediaLoadingProps } from '../types/index.js';

export const MediaLoading: React.FC<MediaLoadingProps> = ({
  message = 'Loading media...',
  className = '',
  style,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`media-loading ${className}`.trim()}
      style={style}
    >
      <span>{message}</span>
    </div>
  );
};
