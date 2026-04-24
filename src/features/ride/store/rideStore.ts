import { create } from 'zustand';
import { Ride, RideStatus, RideSession } from '../types';
import { computeRideCost } from '@features/cost/utils/costCalculator';
import { logger } from '@services/logger';

interface RideState {
  status: RideStatus;
  session: RideSession | null;
  lastRide: Ride | null;
  rideHistory: Ride[];

  startRide: () => void;
  updatePosition: (lat: number, lon: number, distanceDelta: number) => void;
  endRide: (avgMileage: number, fuelPrice: number) => Ride | null;
  setHistory: (rides: Ride[]) => void;
}

export const useRideStore = create<RideState>()((set, get) => ({
  status: 'idle',
  session: null,
  lastRide: null,
  rideHistory: [],

  startRide: () => {
    const now = Date.now();
    logger.info('Ride started', { startTime: now });
    set({
      status: 'active',
      session: {
        startTime: now,
        currentDistance: 0,
        currentDuration: 0,
        lastPosition: null,
      },
    });
  },

  updatePosition: (lat, lon, distanceDelta) => {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        currentDistance: session.currentDistance + distanceDelta,
        currentDuration: Date.now() - session.startTime,
        lastPosition: { latitude: lat, longitude: lon },
      },
    });
  },

  endRide: (avgMileage, fuelPrice) => {
    const { session } = get();
    if (!session) return null;

    const endTime = Date.now();
    const breakdown = computeRideCost(session.currentDistance, avgMileage, fuelPrice);

    const ride: Ride = {
      id: `ride_${session.startTime}`,
      startTime: session.startTime,
      endTime,
      distance: breakdown.distanceKm,
      duration: endTime - session.startTime,
      estimatedFuel: breakdown.fuelUsedL,
      cost: breakdown.totalCostRs,
      costPerKm: breakdown.costPerKm,
    };

    logger.info('Ride ended', { distance: ride.distance, cost: ride.cost });

    set((state) => ({
      status: 'idle',
      session: null,
      lastRide: ride,
      rideHistory: [ride, ...state.rideHistory],
    }));

    return ride;
  },

  setHistory: (rides) => set({ rideHistory: rides }),
}));
