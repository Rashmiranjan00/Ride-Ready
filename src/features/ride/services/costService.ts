export function computeIntelligentCost(
  distanceKm: number,
  durationMinutes: number,
  baseFare: number,
  costPerKm: number,
  costPerMin: number
): number {
  if (distanceKm < 0) distanceKm = 0;
  if (durationMinutes < 0) durationMinutes = 0;

  const distanceCost = distanceKm * costPerKm;
  const timeCost = durationMinutes * costPerMin;

  return baseFare + distanceCost + timeCost;
}
