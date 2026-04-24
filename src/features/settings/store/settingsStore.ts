import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPrefs } from '../types';
import { DEFAULT_MILEAGE_KM, DEFAULT_FUEL_PRICE } from '@shared/constants';

interface SettingsState {
  prefs: UserPrefs;
  updatePrefs: (patch: Partial<UserPrefs>) => void;
  resetPrefs: () => void;
}

const defaultPrefs: UserPrefs = {
  avgMileage: DEFAULT_MILEAGE_KM,
  fuelPrice: DEFAULT_FUEL_PRICE,
  distanceUnit: 'km',
  alwaysStartTracking: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      prefs: defaultPrefs,
      updatePrefs: (patch) => set((state) => ({ prefs: { ...state.prefs, ...patch } })),
      resetPrefs: () => set({ prefs: defaultPrefs }),
    }),
    {
      name: 'rideready-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
