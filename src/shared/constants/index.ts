export const APP_NAME = 'RideReady';

export const CHECKLIST_ITEMS = [
  { id: 'helmet', label: 'Helmet', icon: 'sports_motorsports' },
  { id: 'documents', label: 'Documents', icon: 'description' },
  { id: 'fuel', label: 'Fuel', icon: 'local_gas_station' },
  { id: 'tires', label: 'Tires', icon: 'tire_repair' },
] as const;

export const DEFAULT_MILEAGE_KM = 45; // km/L — a sensible default for Indian bikes
export const DEFAULT_FUEL_PRICE = 105; // ₹/L — approximate Indian fuel price

export const WEATHER_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
