import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/apiClient';
import { getStoredToken } from '@/services/auth';
import type { Asteroid } from '@/types/asteroid';

const WATCHLIST_KEY = 'cosmicwatch_watchlist';
const WATCHLIST_CACHE_KEY = 'cosmicwatch_watchlist_asteroid_cache';

export interface WatchlistItem {
  id?: string;
  asteroidId: string;
  addedAt: string;
  notes?: string;
}

function loadAsteroidCache(): Record<string, Asteroid> {
  try {
    const s = localStorage.getItem(WATCHLIST_CACHE_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (_) {}
  return {};
}

function saveAsteroidCache(cache: Record<string, Asteroid>) {
  try {
    localStorage.setItem(WATCHLIST_CACHE_KEY, JSON.stringify(cache));
  } catch (_) {}
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [asteroidCache, setAsteroidCacheState] = useState<Record<string, Asteroid>>(loadAsteroidCache);
  const token = getStoredToken();
  const useApi = Boolean(token);

  const setAsteroidCache = useCallback((updater: (prev: Record<string, Asteroid>) => Record<string, Asteroid>) => {
    setAsteroidCacheState((prev) => {
      const next = updater(prev);
      saveAsteroidCache(next);
      return next;
    });
  }, []);

  const refetchWatchlist = useCallback(() => {
    if (!token) return;
    apiRequest<{
      success: boolean;
      watchlist?: Array<{
        _id: string;
        asteroidId: string;
        asteroidName?: string;
        asteroidData?: { id?: string; name?: string; nasaId?: string };
        addedAt: string;
        notes?: string;
      }>;
    }>('/api/watchlist')
      .then((data) => {
        const list = (data?.watchlist ?? []).map((w) => ({
          id: w._id,
          asteroidId: w.asteroidId,
          addedAt: typeof w.addedAt === 'string' ? w.addedAt : new Date(w.addedAt).toISOString(),
          notes: w.notes,
        }));
        setWatchlist(list);
        setAsteroidCacheState((prev) => {
          const next = { ...prev };
          (data?.watchlist ?? []).forEach((w) => {
            const id = w.asteroidId;
            if (!next[id]) {
              next[id] = {
                id,
                name: w.asteroidData?.name || w.asteroidName || w.asteroidId,
                nasaId: w.asteroidData?.nasaId || w.asteroidId,
                isHazardous: false,
                diameterMin: 0,
                diameterMax: 0,
                velocity: 0,
                velocityKmps: 0,
                missDistance: 0,
                missDistanceKm: 0,
                orbitingBody: 'Earth',
                closeApproachDate: '',
                absoluteMagnitude: 0,
                riskScore: 'low',
              };
            }
          });
          saveAsteroidCache(next);
          return next;
        });
      })
      .catch(() => setWatchlist([]));
  }, [token]);

  useEffect(() => {
    if (useApi) {
      refetchWatchlist();
    } else {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        try {
          setWatchlist(JSON.parse(stored));
        } catch {
          setWatchlist([]);
        }
      }
    }
  }, [useApi, refetchWatchlist]);

  const saveWatchlistLocal = useCallback((items: WatchlistItem[]) => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items.map(({ id, ...w }) => w)));
    setWatchlist(items);
  }, []);

  const addToWatchlist = useCallback(
    (asteroidId: string, notes?: string, asteroid?: Asteroid) => {
      if (asteroid) {
        setAsteroidCache((prev) => ({ ...prev, [asteroidId]: asteroid }));
      }
      if (useApi) {
        apiRequest<{ success: boolean; watchlistItem?: { _id: string; addedAt: string } }>('/api/watchlist', {
          method: 'POST',
          body: JSON.stringify({
            asteroidId,
            asteroidName: asteroid?.name ?? asteroidId,
            asteroidData: asteroid ? { id: asteroid.id, name: asteroid.name, nasaId: asteroid.nasaId } : {},
            notes,
          }),
        })
          .then((data) => {
            const w = data?.watchlistItem;
            if (w) {
              setWatchlist((prev) => [
                { id: w._id, asteroidId, addedAt: typeof w.addedAt === 'string' ? w.addedAt : new Date().toISOString(), notes },
                ...prev,
              ]);
            }
          })
          .catch(() => {});
        return;
      }
      const existing = watchlist.find((item) => item.asteroidId === asteroidId);
      if (existing) return;
      const newItem: WatchlistItem = { asteroidId, addedAt: new Date().toISOString(), notes };
      saveWatchlistLocal([...watchlist, newItem]);
    },
    [useApi, watchlist, saveWatchlistLocal, refetchWatchlist, setAsteroidCache]
  );

  const removeFromWatchlist = useCallback(
    (asteroidId: string) => {
      setAsteroidCache((prev) => {
        const next = { ...prev };
        delete next[asteroidId];
        return next;
      });
      const item = watchlist.find((w) => w.asteroidId === asteroidId);
      if (useApi && item?.id) {
        apiRequest(`/api/watchlist/${item.id}`, { method: 'DELETE' })
          .then(() => {
            setWatchlist((prev) => prev.filter((w) => w.asteroidId !== asteroidId));
          })
          .catch(() => {
            setWatchlist((prev) => prev.filter((w) => w.asteroidId !== asteroidId));
            refetchWatchlist();
          });
        return;
      }
      saveWatchlistLocal(watchlist.filter((w) => w.asteroidId !== asteroidId));
    },
    [useApi, watchlist, saveWatchlistLocal, refetchWatchlist, setAsteroidCache]
  );

  const isWatched = useCallback(
    (asteroidId: string) => watchlist.some((w) => w.asteroidId === asteroidId),
    [watchlist]
  );

  const updateNotes = useCallback(
    (asteroidId: string, notes: string) => {
      const item = watchlist.find((w) => w.asteroidId === asteroidId);
      if (useApi && item?.id) {
        apiRequest(`/api/watchlist/${item.id}`, { method: 'PUT', body: JSON.stringify({ notes }) })
          .then(() => {
            setWatchlist((prev) => prev.map((w) => (w.asteroidId === asteroidId ? { ...w, notes } : w)));
          })
          .catch(() => {
            setWatchlist((prev) => prev.map((w) => (w.asteroidId === asteroidId ? { ...w, notes } : w)));
            refetchWatchlist();
          });
        return;
      }
      saveWatchlistLocal(watchlist.map((w) => (w.asteroidId === asteroidId ? { ...w, notes } : w)));
    },
    [useApi, watchlist, saveWatchlistLocal, refetchWatchlist]
  );

  return {
    watchlist,
    asteroidCache,
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
    updateNotes,
  };
};
