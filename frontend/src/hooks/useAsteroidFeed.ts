import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/apiClient';
import { mapBackendAsteroidToFrontend } from '@/lib/mapBackendAsteroid';
import { getStoredToken } from '@/services/auth';
import type { Asteroid } from '@/types/asteroid';

function toYYYYMMDD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export type RiskLevelFilter = 'all' | 'low' | 'medium' | 'high';

const DEFAULT_PAGE_SIZE = 20;

/**
 * Asteroid feed: supports (1) browse all with server-side pagination, (2) date range filter.
 * Returns asteroids for current page and totalPages for "Page X of Y".
 */
export function useAsteroidFeed() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromApi, setFromApi] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterStart, setFilterStart] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return toYYYYMMDD(d);
  });
  const [filterEnd, setFilterEnd] = useState<string>(() => {
    const e = new Date();
    e.setMonth(e.getMonth() + 2);
    return toYYYYMMDD(e);
  });
  const [useDateFilter, setUseDateFilter] = useState(false);

  const fetchBrowse = useCallback(async (page: number, size: number, riskLevel?: string) => {
    const token = getStoredToken();
    if (!token) {
      setError('Please log in to load asteroid data.');
      setAsteroids([]);
      setTotalPages(1);
      setTotalElements(0);
      setFromApi(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let url = `/api/feed?page=${page}&size=${size}`;
      if (riskLevel && riskLevel !== 'all') url += `&risk_level=${riskLevel}`;
      const data = await apiRequest<{
        success: boolean;
        asteroids?: unknown[];
        totalPages?: number;
        totalElements?: number;
        page?: number;
      }>(url);
      const raw = data?.asteroids ?? [];
      const list: Asteroid[] = raw.map((a: unknown) =>
        mapBackendAsteroidToFrontend(a as import('@/lib/apiClient').BackendAsteroid)
      );
      setAsteroids(list);
      const total = data?.totalElements ?? list.length;
      const pages = data?.totalPages ?? 1;
      setTotalPages(Math.max(1, pages));
      setTotalElements(total);
      setFromApi(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load feed');
      setAsteroids([]);
      setTotalPages(1);
      setTotalElements(0);
      setFromApi(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByDateRange = useCallback(
    async (start: string, end: string, riskLevel?: string) => {
      const token = getStoredToken();
      if (!token) {
        setError('Please log in to load asteroid data.');
        setAsteroids([]);
        setTotalPages(1);
        setTotalElements(0);
        setFromApi(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        let url = `/api/feed?start_date=${start}&end_date=${end}`;
        if (riskLevel && riskLevel !== 'all') url += `&risk_level=${riskLevel}`;
        const data = await apiRequest<{ success: boolean; asteroids?: unknown[] }>(url);
        const raw = data?.asteroids ?? [];
        const list: Asteroid[] = raw.map((a: unknown) =>
          mapBackendAsteroidToFrontend(a as import('@/lib/apiClient').BackendAsteroid)
        );
        setAsteroids(list);
        setTotalPages(Math.max(1, Math.ceil(list.length / DEFAULT_PAGE_SIZE)));
        setTotalElements(list.length);
        setFromApi(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load feed');
        setAsteroids([]);
        setTotalPages(1);
        setTotalElements(0);
        setFromApi(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const [riskLevel, setRiskLevelState] = useState<RiskLevelFilter>('all');

  useEffect(() => {
    if (useDateFilter) {
      fetchByDateRange(filterStart, filterEnd, riskLevel === 'all' ? undefined : riskLevel);
    } else {
      fetchBrowse(currentPage, DEFAULT_PAGE_SIZE, riskLevel === 'all' ? undefined : riskLevel);
    }
  }, [useDateFilter, currentPage, riskLevel, filterStart, filterEnd, fetchByDateRange, fetchBrowse]);

  const setRiskLevel = useCallback((level: RiskLevelFilter) => {
    setRiskLevelState(level);
    setCurrentPage(0);
  }, []);

  const setFiltersAndRefetch = useCallback(
    (start: string, end: string) => {
      setFilterStart(start);
      setFilterEnd(end);
      setUseDateFilter(true);
      setCurrentPage(0);
      fetchByDateRange(start, end, riskLevel === 'all' ? undefined : riskLevel);
    },
    [fetchByDateRange, riskLevel]
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, page));
  }, []);

  const refetch = useCallback(() => {
    if (useDateFilter) fetchByDateRange(filterStart, filterEnd, riskLevel === 'all' ? undefined : riskLevel);
    else fetchBrowse(currentPage, DEFAULT_PAGE_SIZE, riskLevel === 'all' ? undefined : riskLevel);
  }, [useDateFilter, filterStart, filterEnd, currentPage, riskLevel, fetchByDateRange, fetchBrowse]);

  const paginatedAsteroids = useDateFilter
    ? asteroids.slice(currentPage * DEFAULT_PAGE_SIZE, (currentPage + 1) * DEFAULT_PAGE_SIZE)
    : asteroids;
  const effectiveTotalPages = useDateFilter ? Math.max(1, Math.ceil(asteroids.length / DEFAULT_PAGE_SIZE)) : totalPages;
  const effectiveTotalElements = useDateFilter ? asteroids.length : totalElements;

  return {
    asteroids: paginatedAsteroids,
    loading,
    error,
    fromApi,
    filterStart,
    filterEnd,
    setFilterStart,
    setFilterEnd,
    riskLevel,
    setRiskLevel,
    totalPages: effectiveTotalPages,
    totalElements: effectiveTotalElements,
    currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
    useDateFilter,
    setFiltersAndRefetch,
    goToPage,
    refetch,
    setCurrentPage,
  };
}
