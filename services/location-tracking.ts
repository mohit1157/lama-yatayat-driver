/**
 * LaMa Yatayat Driver - Background Location Tracking
 *
 * Sends GPS coordinates to the backend every 5 seconds while online.
 */

import * as Location from "expo-location";
import { put } from "./api";
import { LOCATION_UPDATE_INTERVAL } from "@/constants/config";

let trackingInterval: ReturnType<typeof setInterval> | null = null;

export async function startLocationTracking(driverId: string): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return false;
  }

  // Clear any existing interval
  stopLocationTracking();

  trackingInterval = setInterval(async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      await put(`/api/v1/geo/drivers/${driverId}/location`, {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        heading: location.coords.heading ?? 0,
        speed: location.coords.speed ?? 0,
      });
    } catch {
      // Silently ignore individual update failures
    }
  }, LOCATION_UPDATE_INTERVAL);

  return true;
}

export function stopLocationTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
}

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;

    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  } catch {
    return null;
  }
}
