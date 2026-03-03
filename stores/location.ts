/**
 * LaMa Yatayat Driver - Location Store
 */

import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  currentLocation: Location.LocationObject | null;
  permissionGranted: boolean;
  isLoading: boolean;
  error: string | null;

  requestPermission: () => Promise<boolean>;
  fetchCurrentLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  permissionGranted: false,
  isLoading: false,
  error: null,

  requestPermission: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === "granted";
      set({ permissionGranted: granted });
      return granted;
    } catch {
      set({ error: "Failed to request location permission" });
      return false;
    }
  },

  fetchCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      set({ currentLocation: location, isLoading: false });
    } catch {
      set({ error: "Failed to get current location", isLoading: false });
    }
  },
}));
