/**
 * Cost calculation utilities — core business logic.
 *
 * Fuel Used (L) = Distance (km) / Avg Mileage (km/L)
 * Cost (₹)     = Fuel Used × Fuel Price (₹/L)
 * Cost/km (₹)  = Total Cost / Distance
 */

export function calcFuelUsed(distanceKm: number, avgMileageKmPerL: number): number {
  if (avgMileageKmPerL <= 0) return 0;
  return distanceKm / avgMileageKmPerL;
}

export function calcCost(fuelUsedLitres: number, fuelPricePerLitre: number): number {
  return fuelUsedLitres * fuelPricePerLitre;
}

export function calcCostPerKm(totalCost: number, distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  return totalCost / distanceKm;
}

export type CostBreakdown = {
  distanceKm: number;
  fuelUsedL: number;
  totalCostRs: number;
  costPerKm: number;
};

export function computeRideCost(
  distanceKm: number,
  avgMileage: number,
  fuelPrice: number
): CostBreakdown {
  const fuelUsedL = calcFuelUsed(distanceKm, avgMileage);
  const totalCostRs = calcCost(fuelUsedL, fuelPrice);
  const costPerKm = calcCostPerKm(totalCostRs, distanceKm);
  return { distanceKm, fuelUsedL, totalCostRs, costPerKm };
}

/** Estimated range from a given fuel amount */
export function estimatedRangeKm(
  fuelAmountRs: number,
  fuelPrice: number,
  avgMileage: number
): number {
  if (fuelPrice <= 0 || avgMileage <= 0) return 0;
  const litres = fuelAmountRs / fuelPrice;
  return litres * avgMileage;
}
