/**
 * Haversine formula — calculates great-circle distance between two GPS coords.
 * Returns distance in kilometers.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Convert km to miles */
export function kmToMi(km: number): number {
  return km * 0.621371;
}

/** Format distance with unit label */
export function formatDistance(km: number, unit: 'km' | 'mi'): string {
  if (unit === 'mi') return `${kmToMi(km).toFixed(1)} mi`;
  return `${km.toFixed(1)} km`;
}
