import { useEffect, useRef, useState, useCallback } from "react";

export function useApi<TResponse = any>(
  apiFn: (...args: any[]) => Promise<TResponse>,
  params: any[] | object,
  options?: {
    enabled?: boolean;
    immediate?: boolean;
    onSuccess?: (data: TResponse) => void;
    onError?: (err: any) => void;
  }
) {
  const {
    enabled = true,
    immediate = true,
    onSuccess,
    onError,
  } = options || {};

  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<any>(null);

  const paramsRef = useRef<string>(""); // store JSON string of params

  // Stable fetch function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (Array.isArray(params)) {
        result = await apiFn(...params);
      } else if (apiFn.length > 1) {
        result = await apiFn(...Object.values(params));
      } else {
        result = await apiFn(params);
      }

      setData(result);
      onSuccess?.(result);
    } catch (err: any) {
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [apiFn, params, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) return;

    // Only trigger if params actually changed
    const serialized = JSON.stringify(params);
    if (paramsRef.current === serialized && data != null) return;
    paramsRef.current = serialized;

    if (immediate) {
      fetchData();
    }
  }, [enabled, fetchData, immediate, data, params]);

  return { data, loading, error, refetch: fetchData };
}
