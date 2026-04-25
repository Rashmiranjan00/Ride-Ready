import { useCallback, useMemo } from 'react';
import { Linking } from 'react-native';
import { useRideStore } from '../store/rideStore';
import { startRideTracking, stopRideTracking } from '../services/locationService';
import { useSettingsStore } from '@features/settings/store/settingsStore';
import { computeIntelligentCost } from '../services/costService';
import { useTimer } from './useTimer';

export function useRideIntelligence() {
  const {
    startRide: storeStartRide,
    stopRide: storeStopRide,
    pauseRide: storePauseRide,
    resumeRide: storeResumeRide,
    isActive,
    status,
    startTime,
    pauseTime,
    distance,
    route,
  } = useRideStore();

  const { prefs } = useSettingsStore();
  const currentDurationMs = useTimer(startTime, pauseTime);

  const cost = useMemo(() => {
    if (!isActive) return 0;
    const distanceKm = distance / 1000;
    const durationMinutes = currentDurationMs / 60000;
    return computeIntelligentCost(
      distanceKm,
      durationMinutes,
      prefs.baseFare,
      prefs.costPerKm,
      prefs.costPerMin
    );
  }, [isActive, distance, currentDurationMs, prefs.baseFare, prefs.costPerKm, prefs.costPerMin]);

  const startRide = useCallback(async () => {
    if (isActive) return;
    storeStartRide();
    await startRideTracking();

    try {
      await Linking.openURL('https://www.google.com/maps/dir/?api=1');
    } catch {
      // Ignore if linking fails
    }
  }, [isActive, storeStartRide]);

  const pauseRide = useCallback(async () => {
    if (status !== 'active') return;
    storePauseRide();
    await stopRideTracking();
  }, [status, storePauseRide]);

  const resumeRide = useCallback(async () => {
    if (status !== 'paused') return;
    storeResumeRide();
    await startRideTracking();
  }, [status, storeResumeRide]);

  const stopRide = useCallback(async () => {
    if (!isActive) return null;
    await stopRideTracking();
    return storeStopRide(prefs.avgMileage, prefs.fuelPrice);
  }, [isActive, storeStopRide, prefs.avgMileage, prefs.fuelPrice]);

  return {
    startRide,
    pauseRide,
    resumeRide,
    stopRide,
    isActive,
    status,
    cost,
    route,
    distance,
    durationMs: currentDurationMs,
  };
}
