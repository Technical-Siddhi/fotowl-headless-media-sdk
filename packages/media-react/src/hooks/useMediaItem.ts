import { useCallback, useEffect, useRef, useState } from 'react';
import type { MediaAsset, MediaSDKError } from '@fotowl/media-core';
import { useMediaSDK } from './useMediaSDK.js';
import type { QueryHookOptions, UseQueryResult } from '../types/index.js';

export function useMediaItem(
  id: string | number | null,
  options?: QueryHookOptions
): UseQueryResult<MediaAsset> {
  const sdk = useMediaSDK();
  const [data, setData] = useState<MediaAsset | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<MediaSDKError | Error | null>(null);

  const enabled = options?.enabled ?? true;

  const requestIdRef = useRef(0);
  const idRef = useRef(id);
  idRef.current = id;

  const executeFetch = useCallback(
    async (itemId: string | number | null) => {
      if (!enabled || itemId === null || itemId === undefined || String(itemId).trim().length === 0) {
        setIsLoading(false);
        return;
      }

      const currentRequestId = ++requestIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const result = await sdk.getById(itemId);
        if (currentRequestId === requestIdRef.current) {
          setData(result);
          setError(null);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (currentRequestId === requestIdRef.current) {
          setError(err);
          setData(null);
          setIsLoading(false);
        }
      }
    },
    [sdk, enabled]
  );

  useEffect(() => {
    let isMounted = true;
    if (!enabled || id === null || id === undefined || String(id).trim().length === 0) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    sdk
      .getById(id)
      .then((result) => {
        if (isMounted && currentRequestId === requestIdRef.current) {
          setData(result);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted && currentRequestId === requestIdRef.current) {
          setError(err);
          setData(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sdk, enabled, id]);

  const refetch = useCallback(async () => {
    sdk.clearCache();
    await executeFetch(idRef.current);
  }, [sdk, executeFetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
