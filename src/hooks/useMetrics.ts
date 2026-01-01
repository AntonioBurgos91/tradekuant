'use client';

import { useEffect, useState } from 'react';
import type { MetricsCache, GlobalMetricsCache } from '@/lib/db/types';

interface UseMetricsOptions {
  platformId?: number;
  period?: string;
  global?: boolean;
}

interface UseMetricsReturn {
  data: MetricsCache | GlobalMetricsCache | Record<number, Record<string, MetricsCache>> | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useMetrics({
  platformId,
  period = 'all',
  global = false,
}: UseMetricsOptions = {}): UseMetricsReturn {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (platformId) params.append('platformId', platformId.toString());
      if (period) params.append('period', period);
      if (global) params.append('global', 'true');

      const response = await fetch(`/api/metrics?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [platformId, period, global]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
}
