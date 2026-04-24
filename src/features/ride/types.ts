export type Ride = {
  id: string;
  startTime: number; // Unix ms
  endTime: number; // Unix ms
  distance: number; // kilometers
  duration: number; // milliseconds
  estimatedFuel: number; // liters
  cost: number; // ₹
  costPerKm: number; // ₹/km
};

export type RideStatus = 'idle' | 'active' | 'ending';

export type RideSession = {
  startTime: number;
  currentDistance: number;
  currentDuration: number;
  lastPosition: { latitude: number; longitude: number } | null;
};
