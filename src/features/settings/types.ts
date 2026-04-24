export type UserPrefs = {
  avgMileage: number; // km/L
  fuelPrice: number; // ₹ per litre
  distanceUnit: 'km' | 'mi';
  alwaysStartTracking: boolean; // Skip "Start Ride" confirmation modal
};
