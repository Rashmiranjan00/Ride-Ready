export type FuelLog = {
  id: string;
  date: number; // Unix ms
  amount: number; // ₹ spent
  liters?: number; // Optional — for accurate price computation
};
