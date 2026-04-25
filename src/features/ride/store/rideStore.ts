import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ride, RideStatus, RideSession } from '../types';
import { computeRideCost } from '@features/cost/utils/costCalculator';
import { haversineDistanceMeters } from '../utils/distance';
import { logger } from '@services/logger';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp: number;
}

interface RideState {
  status: RideStatus;
  isActive: boolean;
  startTime: number | null;
  distance: number; // in meters
  lastPoint: LocationPoint | null;
  lastRide: Ride | null;
  rideHistory: Ride[];

  startRide: () => void;
  stopRide: (avgMileage: number, fuelPrice: number) => Ride | null;
  addLocationPoint: (point: LocationPoint) => void;
  setHistory: (rides: Ride[]) => void;

  // Legacy for UI consumers until fully updated
  session: RideSession | null;
}

export const useRideStore = create<RideState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      isActive: false,
      startTime: null,
      distance: 0,
      lastPoint: null,
      lastRide: null,
      rideHistory: [],
      session: null,

      startRide: () => {
        const now = Date.now();
        logger.info('Ride started', { startTime: now });
        set({
          status: 'active',
          isActive: true,
          startTime: now,
          distance: 0,
          lastPoint: null,
          session: {
            startTime: now,
            currentDistance: 0,
            currentDuration: 0,
            lastPosition: null,
          },
        });
      },

      addLocationPoint: (point) => {
        const { isActive, lastPoint, distance, session } = get();
        if (!isActive) return;

        // Filter bad accuracy (>30m)
        if (point.accuracy && point.accuracy > 30) {
          logger.debug('Ignored point: poor accuracy', { accuracy: point.accuracy });
          return;
        }

        let newDistance = distance;

        if (lastPoint) {
          const distanceDelta = haversineDistanceMeters(
            lastPoint.latitude,
            lastPoint.longitude,
            point.latitude,
            point.longitude
          );

          // Ignore jumps <2m (noise) or >100m (gps glitch between ticks)
          if (distanceDelta >= 2 && distanceDelta <= 100) {
            newDistance += distanceDelta;
            logger.debug('Distance updated', { delta: distanceDelta, total: newDistance });
          } else {
            logger.debug('Ignored point: jump too big/small', { delta: distanceDelta });
          }
        }

        set({
          lastPoint: point,
          distance: newDistance,
          // Sync legacy session for now
          session: session
            ? {
                ...session,
                currentDistance: newDistance / 1000, // session expects km
                currentDuration: Date.now() - session.startTime,
                lastPosition: { latitude: point.latitude, longitude: point.longitude },
              }
            : null,
        });
      },

      stopRide: (avgMileage, fuelPrice) => {
        const { isActive, startTime, distance } = get();
        if (!isActive || !startTime) return null;

        const endTime = Date.now();
        const distanceKm = distance / 1000;
        const breakdown = computeRideCost(distanceKm, avgMileage, fuelPrice);

        const ride: Ride = {
          id: `ride_${startTime}`,
          startTime: startTime,
          endTime,
          distance: breakdown.distanceKm,
          duration: endTime - startTime,
          estimatedFuel: breakdown.fuelUsedL,
          cost: breakdown.totalCostRs,
          costPerKm: breakdown.costPerKm,
        };

        logger.info('Ride ended', { distance: ride.distance, cost: ride.cost });

        set((state) => ({
          status: 'idle',
          isActive: false,
          startTime: null,
          distance: 0,
          lastPoint: null,
          session: null,
          lastRide: ride, // Legacy field
          rideHistory: [ride, ...state.rideHistory],
        }));

        return ride;
      },

      setHistory: (rides) => set({ rideHistory: rides }),
    }),
    {
      name: 'ride-ready-ride-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist the necessary fields for resuming
        isActive: state.isActive,
        startTime: state.startTime,
        distance: state.distance,
        lastPoint: state.lastPoint,
        rideHistory: state.rideHistory,
        session: state.session, // Legacy
        status: state.status, // Legacy
      }),
    }
  )
);
