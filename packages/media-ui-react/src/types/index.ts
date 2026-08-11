import type React from 'react';

export type MediaType = 'photo' | 'video' | 'audio';

export interface MediaAuthor {
  name: string;
  url?: string;
  avatarUrl?: string;
}

export interface MediaSourceVariants {
  original: string;
  large: string;
  medium: string;
  small: string;
  portrait?: string;
  landscape?: string;
  tiny: string;
}

export interface MediaVideoFile {
  id?: number | string;
  quality?: string;
  fileType?: string;
  width?: number;
  height?: number;
  link: string;
}

export interface MediaAsset {
  id: string;
  type: MediaType;
  title: string;
  url: string;
  previewUrl: string;
  downloadUrl?: string;
  width: number;
  height: number;
  author: MediaAuthor;
  src: MediaSourceVariants;
  avgColor?: string;
  videoFiles?: MediaVideoFile[];
  metadata?: Record<string, unknown>;
}

export interface MediaSDKError {
  message: string;
  code?: string;
  status?: number;
}

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
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface MediaSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (query: string) => void;
  initialQuery?: string;
  perPage?: number;
  query?: string;
  onSearch?: (query: string) => void;
  assets?: MediaAsset[];
  isLoading?: boolean;
  error?: MediaSDKError | Error | null;
  page?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  onPageChange?: (page: number) => void;
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

export interface MediaReelProps {
  assets: MediaAsset[];
  activeIndex?: number;
  onActiveChange?: (asset: MediaAsset, index: number) => void;
  onSelectAsset?: (asset: MediaAsset) => void;
  onDownloadAsset?: (asset: MediaAsset) => void;
  renderItem?: (asset: MediaAsset, isActive: boolean, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface UseMediaUIResult {
  selectedAsset: MediaAsset | null;
  isModalOpen: boolean;
  openAsset: (asset: MediaAsset) => void;
  closeAsset: () => void;
}
