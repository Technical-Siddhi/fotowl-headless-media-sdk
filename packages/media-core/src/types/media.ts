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

export interface MediaAsset {
  id: string;
  type: MediaType;
  title: string;
  url: string;
  previewUrl: string;
  downloadUrl?: string; // Optional: provider might not guarantee downloadable URL
  width: number;
  height: number;
  author: MediaAuthor;
  src: MediaSourceVariants;
  avgColor?: string;
  metadata?: Record<string, unknown>;
}

export interface MediaSearchParams {
  query: string;
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  color?: string;
  locale?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  totalResults?: number;
  nextPage?: number;
  prevPage?: number;
  hasNext?: boolean;
}

export interface MediaSearchResult {
  assets: MediaAsset[];
  pagination: PaginationMeta;
}
