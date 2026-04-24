import * as Location from 'expo-location';
import { useRideStore } from '../store/rideStore';
import { haversineDistanceKm } from '../utils/distance';
import { logger } from '@services/logger';

let locationSubscription: Location.LocationSubscription | null = null;

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function startLocationTracking(): Promise<void> {
  if (locationSubscription) return; // already tracking

  const granted = await requestLocationPermission();
  if (!granted) {
    throw new Error('Location permission denied');
  }

  locationSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 10, // minimum 10m movement before update
      timeInterval: 5000, // or at least every 5 seconds
    },
    (location) => {
      const { latitude, longitude } = location.coords;
      const { session, updatePosition } = useRideStore.getState();

      if (!session) {
        stopLocationTracking();
        return;
      }

      let distanceDelta = 0;
      if (session.lastPosition) {
        distanceDelta = haversineDistanceKm(
          session.lastPosition.latitude,
          session.lastPosition.longitude,
          latitude,
          longitude
        );
      }

      // Filter out GPS noise — skip if delta < 0.005km (5m)
      if (distanceDelta < 0.005 && session.lastPosition !== null) return;

      updatePosition(latitude, longitude, distanceDelta);
      logger.debug('Position updated', { lat: latitude, lon: longitude, delta: distanceDelta });
    }
  );

  logger.info('Location tracking started');
}

export function stopLocationTracking(): void {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
    logger.info('Location tracking stopped');
  }
}
