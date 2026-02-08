import { useMemo } from 'react';
import type { Asteroid } from '@/types/asteroid';
import { AlertSettings } from '@/hooks/useAlertSettings';

interface UseAlertNotificationsProps {
  settings: AlertSettings;
  watchedAsteroidIds?: string[];
  asteroids?: Asteroid[];
}

export const useAlertNotifications = ({ settings, watchedAsteroidIds = [], asteroids = [] }: UseAlertNotificationsProps) => {
  const alertAsteroids = useMemo(() => {
    if (!settings.enabled || asteroids.length === 0) return [];
    return asteroids.filter((asteroid) => {
      if (asteroid.riskScore === 'high' && !settings.showHighRisk) return false;
      if (asteroid.riskScore === 'medium' && !settings.showMediumRisk) return false;
      if (asteroid.riskScore === 'low' && !settings.showLowRisk) return false;
      const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
      if (avgDiameter < settings.minDiameter) return false;
      if (settings.notifyWatchlistOnly && !watchedAsteroidIds.includes(asteroid.id)) return false;
      const now = new Date();
      const approachDate = new Date(asteroid.closeApproachDate);
      const daysUntil = Math.ceil((approachDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil > settings.daysAhead || daysUntil < 0) return false;
      return true;
    });
  }, [settings, watchedAsteroidIds, asteroids]);

  return { alertAsteroids, alertCount: alertAsteroids.length };
};
