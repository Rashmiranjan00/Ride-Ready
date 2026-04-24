import { useEffect, useState, useCallback } from 'react';
import { fetchWeather, getLastKnownWeather } from '../services/weatherService';
import { WeatherData } from '../types';
import { logger } from '@services/logger';

type WeatherHookResult = {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useWeather(): WeatherHookResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const weather = await fetchWeather();
      setData(weather);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather';
      logger.warn('Weather fetch failed, trying cache', message);
      setError(message);
      // Offline fallback
      const fallback = await getLastKnownWeather();
      if (fallback) setData(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
