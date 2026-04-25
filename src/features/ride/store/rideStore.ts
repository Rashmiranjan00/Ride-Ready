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
  pauseTime: number | null;
  distance: number; // in meters
  lastPoint: LocationPoint | null;
  route: LocationPoint[];
  lastRide: Ride | null;
  rideHistory: Ride[];

  startRide: () => void;
  pauseRide: () => void;
  resumeRide: () => void;
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
      pauseTime: null,
      distance: 0,
      lastPoint: null,
      route: [],
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
          pauseTime: null,
          distance: 0,
          lastPoint: null,
          route: [],
          session: {
            startTime: now,
            currentDistance: 0,
            currentDuration: 0,
            lastPosition: null,
          },
        });
      },

      addLocationPoint: (point) => {
        const { isActive, status, lastPoint, distance, session, route } = get();
        if (!isActive || status === 'paused') return;

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

        let newRoute = route;
        const lastRoutePoint = route[route.length - 1];
        // Store point if route is empty or 3 seconds have passed since last stored point
        if (!lastRoutePoint || point.timestamp - lastRoutePoint.timestamp > 3000) {
          newRoute = [...route, point];
        }

        set({
          lastPoint: point,
          distance: newDistance,
          route: newRoute,
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

      pauseRide: () => {
        const { isActive, status } = get();
        if (isActive && status === 'active') {
          set({ status: 'paused', pauseTime: Date.now() });
          logger.info('Ride paused');
        }
      },

      resumeRide: () => {
        const { isActive, status, pauseTime, startTime } = get();
        if (isActive && status === 'paused' && pauseTime && startTime) {
          const pausedDuration = Date.now() - pauseTime;
          set({
            status: 'active',
            pauseTime: null,
            startTime: startTime + pausedDuration,
          });
          logger.info('Ride resumed', { pausedDuration });
        }
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
          pauseTime: null,
          distance: 0,
          lastPoint: null,
          route: [],
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
        pauseTime: state.pauseTime,
        distance: state.distance,
        lastPoint: state.lastPoint,
        route: state.route,
        rideHistory: state.rideHistory,
        session: state.session, // Legacy
        status: state.status, // Legacy
      }),
    }
  )
);
