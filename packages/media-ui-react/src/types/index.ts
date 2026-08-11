import type React from 'react';
import type { MediaAsset, MediaSDKError } from '@fotowl/media-react';

export interface MediaCardProps {
  asset: MediaAsset;
  onSelect?: (asset: MediaAsset) => void;
  onDownload?: (asset: MediaAsset) => void;
  extraActions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface MediaGridProps {
  assets: MediaAsset[];
  onSelectAsset?: (asset: MediaAsset) => void;
  onDownloadAsset?: (asset: MediaAsset) => void;
  renderItem?: (asset: MediaAsset) => React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface MediaSearchProps {
  initialQuery?: string;
  perPage?: number;
  onSelectAsset?: (asset: MediaAsset) => void;
  onDownloadAsset?: (asset: MediaAsset) => void;
  renderItem?: (asset: MediaAsset) => React.ReactNode;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  errorState?: (error: MediaSDKError | Error) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface MediaModalProps {
  isOpen: boolean;
  asset: MediaAsset | null;
  onClose: () => void;
  onDownload?: (asset: MediaAsset) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface MediaPaginationProps {
  page: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface MediaLoadingProps {
  message?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface MediaErrorProps {
  error: MediaSDKError | Error | null;
  onRetry?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface UseMediaUIResult {
  selectedAsset: MediaAsset | null;
  isModalOpen: boolean;
  openAsset: (asset: MediaAsset) => void;
  closeAsset: () => void;
}
