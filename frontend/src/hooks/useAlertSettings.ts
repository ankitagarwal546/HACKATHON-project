import { useState, useEffect, useCallback } from 'react';

const ALERT_SETTINGS_KEY = 'cosmicwatch_alert_settings';

export interface AlertSettings {
  enabled: boolean;
  showHighRisk: boolean;
  showMediumRisk: boolean;
  showLowRisk: boolean;
  daysAhead: number; // Show alerts for approaches within X days
  minDiameter: number; // Minimum diameter in meters to trigger alert
  notifyWatchlistOnly: boolean;
  /** Minimum risk score (0–100). Alerts only for asteroids at or above this. Stored in localStorage; later backend will persist. */
  minRiskScore: number;
  /** Only show/alert for hazardous asteroids. Stored in localStorage; later backend will persist. */
  onlyHazardous: boolean;
}

const defaultSettings: AlertSettings = {
  enabled: true,
  showHighRisk: true,
  showMediumRisk: true,
  showLowRisk: false,
  daysAhead: 30,
  minDiameter: 0,
  notifyWatchlistOnly: false,
  minRiskScore: 0,
  onlyHazardous: false,
};

export const useAlertSettings = () => {
  const [settings, setSettings] = useState<AlertSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem(ALERT_SETTINGS_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to parse alert settings:', e);
      }
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AlertSettings>) => {
    const updated = { ...settings, ...newSettings };
    localStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(updated));
    setSettings(updated);
  }, [settings]);

  const resetSettings = useCallback(() => {
    localStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(defaultSettings));
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
};
