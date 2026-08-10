import { useEffect, useRef } from 'react';
import type { MediaEventMap } from '@fotowl/media-core';
import { useMediaSDK } from './useMediaSDK.js';

export function useMediaEvent<E extends keyof MediaEventMap>(
  event: E,
  handler: (payload: MediaEventMap[E]) => void
): void {
  const sdk = useMediaSDK();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const stableListener = (payload: MediaEventMap[E]) => {
      if (handlerRef.current) {
        handlerRef.current(payload);
      }
    };

    const unsubscribe = sdk.on(event, stableListener);
    return () => {
      unsubscribe();
    };
  }, [sdk, event]);
}
