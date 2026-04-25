import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useRideStore } from '../store/rideStore';
import { startRideTracking, stopRideTracking } from '../services/locationService';
import { useSettingsStore } from '@features/settings/store/settingsStore';

export function useRideTracking() {
  const { startRide: storeStartRide, stopRide: storeStopRide, isActive } = useRideStore();
  const { prefs } = useSettingsStore();

  const startRide = useCallback(async () => {
    if (isActive) return;

    // 1. Update Zustand store
    storeStartRide();

    // 2. Start background tracking
    await startRideTracking();

    // 3. Open Google Maps via deep link
    const mapsUrl = 'https://www.google.com/maps/dir/?api=1';
    try {
      await Linking.openURL(mapsUrl);
    } catch {
      // Ignore if linking fails
    }
  }, [isActive, storeStartRide]);

  const stopRide = useCallback(async () => {
    if (!isActive) return null;

    // 1. Stop tracking
    await stopRideTracking();

    // 2. Update store and get ride summary
    const ride = storeStopRide(prefs.avgMileage, prefs.fuelPrice);
    return ride;
  }, [isActive, storeStopRide, prefs.avgMileage, prefs.fuelPrice]);

  return {
    startRide,
    stopRide,
    isActive,
  };
}
