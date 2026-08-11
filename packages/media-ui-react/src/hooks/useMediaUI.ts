import { useCallback, useState } from 'react';
import type { MediaAsset, UseMediaUIResult } from '../types/index.js';

export function useMediaUI(): UseMediaUIResult {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openAsset = useCallback((asset: MediaAsset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  }, []);

  const closeAsset = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  }, []);

  return {
    selectedAsset,
    isModalOpen,
    openAsset,
    closeAsset,
  };
}
