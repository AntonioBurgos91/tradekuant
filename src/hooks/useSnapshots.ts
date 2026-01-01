'use client';

import { useEffect, useState } from 'react';
import type { Snapshot, SnapshotWithPlatform } from '@/lib/db/types';

interface UseSnapshotsOptions {
  platformId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  withPlatform?: boolean;
}

interface UseSnapshotsReturn {
  data: Snapshot[] | SnapshotWithPlatform[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSnapshots({
  platformId,
  startDate,
  endDate,
  limit,
  withPlatform = false,
}: UseSnapshotsOptions = {}): UseSnapshotsReturn {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSnapshots = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (platformId) params.append('platformId', platformId.toString());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (limit) params.append('limit', limit.toString());
      if (withPlatform) params.append('withPlatform', 'true');

      const response = await fetch(`/api/snapshots?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch snapshots');
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data || []);
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
    fetchSnapshots();
  }, [platformId, startDate, endDate, limit, withPlatform]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSnapshots,
  };
}
