export type UserPrefs = {
  avgMileage: number; // km/L
  fuelPrice: number; // ₹ per litre
  distanceUnit: 'km' | 'mi';
  alwaysStartTracking: boolean; // Skip "Start Ride" confirmation modal
  currency: 'INR' | 'USD';
  baseFare: number;
  costPerKm: number;
  costPerMin: number;
};
