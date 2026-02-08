import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/apiClient';
import { mapBackendAsteroidToFrontend } from '@/lib/mapBackendAsteroid';
import type { Asteroid } from '@/types/asteroid';
import type { BackendAsteroid } from '@/lib/apiClient';

export function useAsteroidLookup(asteroidId: string | undefined) {
  const [asteroid, setAsteroid] = useState<Asteroid | null>(null);
  const [loading, setLoading] = useState(!!asteroidId);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!asteroidId) {
      setAsteroid(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<{ success: boolean; asteroid?: BackendAsteroid }>(
        `/api/lookup/${encodeURIComponent(asteroidId)}`
      );
      const raw = data?.asteroid;
      if (!raw) {
        setAsteroid(null);
        setError('Asteroid not found');
        return;
      }
      setAsteroid(mapBackendAsteroidToFrontend(raw));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load asteroid');
      setAsteroid(null);
    } finally {
      setLoading(false);
    }
  }, [asteroidId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { asteroid, loading, error, refetch };
}
