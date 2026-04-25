import * as Location from 'expo-location';
import { LOCATION_TASK_NAME } from './backgroundLocationTask';
import { logger } from '@services/logger';

export async function requestLocationPermission(): Promise<boolean> {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') return false;

  const bg = await Location.requestBackgroundPermissionsAsync();
  return bg.status === 'granted';
}

export async function startRideTracking(): Promise<void> {
  const granted = await requestLocationPermission();
  if (!granted) {
    logger.error('Location permission denied for background tracking');
    return;
  }

  const isTaskRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isTaskRegistered) {
    logger.info('Location task already registered');
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 3000,
    distanceInterval: 5,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'RideReady is tracking your ride',
      notificationBody: 'Distance and duration are being updated in real-time.',
      notificationColor: '#1E1E1E',
    },
  });

  logger.info('Background location tracking started');
}

export async function stopRideTracking(): Promise<void> {
  const isTaskRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isTaskRegistered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    logger.info('Background location tracking stopped');
  }
}
