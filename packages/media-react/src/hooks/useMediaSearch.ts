import { useCallback, useEffect, useRef, useState } from 'react';
import type { MediaSearchParams, MediaSearchResult, MediaSDKError } from '@fotowl/media-core';
import { useMediaSDK } from './useMediaSDK.js';
import type { QueryHookOptions, UseQueryResult } from '../types/index.js';

export function useMediaSearch(
  params: MediaSearchParams | null,
  options?: QueryHookOptions
): UseQueryResult<MediaSearchResult> {
  const sdk = useMediaSDK();
  const [data, setData] = useState<MediaSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<MediaSDKError | Error | null>(null);

  const enabled = options?.enabled ?? true;

  const requestIdRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const executeSearch = useCallback(
    async (searchParams: MediaSearchParams | null) => {
      if (!enabled || !searchParams || !searchParams.query || searchParams.query.trim().length === 0) {
        setIsLoading(false);
        return;
      }

      const currentRequestId = ++requestIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const result = await sdk.search(searchParams);
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

  const serializedParams = params ? JSON.stringify(params) : null;

  useEffect(() => {
    let isMounted = true;
    if (!enabled || !params || !params.query || params.query.trim().length === 0) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    sdk
      .search(params)
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
  }, [sdk, enabled, serializedParams]);

  const refetch = useCallback(async () => {
    sdk.clearCache();
    await executeSearch(paramsRef.current);
  }, [sdk, executeSearch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
