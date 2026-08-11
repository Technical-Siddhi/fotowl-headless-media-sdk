import React, { useState } from 'react';
import { View, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export interface NativeMediaAsset {
  id: string;
  type?: 'photo' | 'video' | 'audio';
  title: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
  [key: string]: unknown;
}

export interface MediaReelNativeProps {
  assets: NativeMediaAsset[];
  activeIndex?: number;
  onActiveChange?: (asset: NativeMediaAsset, index: number) => void;
  onSelectAsset?: (asset: NativeMediaAsset) => void;
  renderItem?: (asset: NativeMediaAsset, isActive: boolean, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
}

export const MediaReelNative = ({
  assets = [],
  activeIndex: controlledIndex,
  onActiveChange,
  renderItem,
  emptyState,
  onLoadMore,
}: MediaReelNativeProps) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;
  const screenHeight = Dimensions.get('window').height;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / screenHeight);
    if (index >= 0 && index < assets.length && index !== activeIndex) {
      setInternalIndex(index);
      if (onActiveChange && assets[index]) {
        onActiveChange(assets[index], index);
      }
    }
  };

  if (!assets || assets.length === 0) {
    return React.createElement(View, null, emptyState);
  }

  return React.createElement(FlatList, {
    data: assets as any[],
    keyExtractor: (item: any) => item.id,
    pagingEnabled: true,
    onScroll: handleScroll,
    scrollEventThrottle: 16,
    onEndReached: onLoadMore,
    onEndReachedThreshold: 0.5,
    renderItem: ({ item, index }: any) => {
      const isActive = index === activeIndex;
      return React.createElement(
        View,
        { style: { height: screenHeight, width: '100%' } },
        renderItem ? renderItem(item, isActive, index) : null
      );
    },
  });
};
