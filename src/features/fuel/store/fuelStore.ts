import { create } from 'zustand';
import { FuelLog } from '../types';
import { estimatedRangeKm } from '@features/cost/utils/costCalculator';

interface FuelState {
  logs: FuelLog[];
  addLog: (log: FuelLog) => void;
  setLogs: (logs: FuelLog[]) => void;
  latestLog: () => FuelLog | null;
  estimatedRange: (fuelPrice: number, avgMileage: number) => number;
}

export const useFuelStore = create<FuelState>()((set, get) => ({
  logs: [],

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
    })),

  setLogs: (logs) => set({ logs }),

  latestLog: () => {
    const { logs } = get();
    return logs.length > 0 ? logs[0] : null;
  },

  estimatedRange: (fuelPrice, avgMileage) => {
    const { logs } = get();
    if (logs.length === 0) return 0;
    const latest = logs[0];
    return estimatedRangeKm(latest.amount, fuelPrice, avgMileage);
  },
}));
