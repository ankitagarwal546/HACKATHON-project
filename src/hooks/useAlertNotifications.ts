import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { mockAsteroids } from '@/data/mockAsteroids';

export const useAlertNotifications = () => {
  const hasShownAlerts = useRef(false);

  useEffect(() => {
    if (hasShownAlerts.current) return;
    hasShownAlerts.current = true;

    // Find high-risk asteroids
    const highRiskAsteroids = mockAsteroids.filter(a => a.riskScore === 'high' || (a.isHazardous && a.riskScore === 'medium'));

    // Show alerts with delays
    highRiskAsteroids.forEach((asteroid, index) => {
      const now = new Date();
      const approachDate = new Date(asteroid.closeApproachDate);
      const daysUntil = Math.ceil((approachDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      setTimeout(() => {
        const timeText = daysUntil > 0 ? `Approaching in ${daysUntil} days` : 'Imminent approach';
        
        toast({
          title: '⚠️ Close Approach Alert',
          description: `${asteroid.name} — Distance: ${(asteroid.missDistanceKm / 1000000).toFixed(2)}M km — ${timeText}`,
          variant: asteroid.riskScore === 'high' ? 'destructive' : 'default',
          duration: 8000,
        });
      }, 1500 + index * 2000);
    });
  }, []);
};
