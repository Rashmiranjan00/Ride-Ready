import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { useRideStore } from '../store/rideStore';
import { logger } from '@services/logger';

export const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    logger.error('Background location task error', error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (!locations || locations.length === 0) return;

    for (const location of locations) {
      const { latitude, longitude, accuracy } = location.coords;
      const timestamp = location.timestamp;

      useRideStore.getState().addLocationPoint({
        latitude,
        longitude,
        accuracy,
        timestamp,
      });
    }
  }
});
