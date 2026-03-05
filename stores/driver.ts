/**
 * LaMa Yatayat Driver - Driver Store (Zustand)
 *
 * Manages online status, current batch, and active trip state.
 */

import { create } from "zustand";
import { post, put, get } from "@/services/api";
import { startLocationTracking, stopLocationTracking } from "@/services/location-tracking";
import { wsManager } from "@/services/websocket";
import type { Batch, Waypoint } from "@/lib/types";

interface DriverState {
  isOnline: boolean;
  destination: { lat: number; lng: number; address: string } | null;
  currentBatch: Batch | null;
  pendingBatch: Batch | null;
  completedWaypoints: Set<string>;
  isLoading: boolean;

  goOnline: (driverId: string) => Promise<void>;
  goOffline: (driverId: string) => Promise<void>;
  setDestination: (dest: { lat: number; lng: number; address: string } | null) => void;
  setPendingBatch: (batch: Batch | null) => void;
  acceptBatch: (batchId: string) => Promise<void>;
  declineBatch: (batchId: string) => Promise<void>;
  completeWaypoint: (waypointKey: string) => void;
  confirmPickup: (rideId: string) => Promise<void>;
  confirmDropoff: (rideId: string) => Promise<void>;
  completeBatch: () => void;
  reset: () => void;
}

export const useDriverStore = create<DriverState>((set, getState) => ({
  isOnline: false,
  destination: null,
  currentBatch: null,
  pendingBatch: null,
  completedWaypoints: new Set(),
  isLoading: false,

  goOnline: async (driverId: string) => {
    set({ isLoading: true });
    try {
      await put(`/api/v1/geo/drivers/${driverId}/status`, { status: "online" });
      await startLocationTracking(driverId);

      // Connect WebSocket for batch notifications
      wsManager.connect({ user_id: driverId, role: "driver" });

      set({ isOnline: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err; // Re-throw so the UI can show an alert
    }
  },

  goOffline: async (driverId: string) => {
    set({ isLoading: true });
    try {
      await put(`/api/v1/geo/drivers/${driverId}/status`, { status: "offline" });
      stopLocationTracking();
      wsManager.disconnect();

      set({ isOnline: false, destination: null, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err; // Re-throw so the UI can show an alert
    }
  },

  setDestination: (dest) => set({ destination: dest }),

  setPendingBatch: (batch) => set({ pendingBatch: batch }),

  acceptBatch: async (batchId: string) => {
    set({ isLoading: true });
    try {
      const batch = await post<Batch>(`/api/v1/rides/batches/${batchId}/accept`);
      set({
        currentBatch: batch ?? getState().pendingBatch,
        pendingBatch: null,
        completedWaypoints: new Set(),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  declineBatch: async (batchId: string) => {
    try {
      await post(`/api/v1/rides/batches/${batchId}/decline`);
    } catch {
      // Ignore errors
    }
    set({ pendingBatch: null });
  },

  completeWaypoint: (waypointKey: string) => {
    const updated = new Set(getState().completedWaypoints);
    updated.add(waypointKey);
    set({ completedWaypoints: updated });
  },

  confirmPickup: async (rideId: string) => {
    await post(`/api/v1/rides/${rideId}/pickup`);
    const state = getState();
    const key = `pickup_${rideId}`;
    const updated = new Set(state.completedWaypoints);
    updated.add(key);

    // Update ride status in current batch
    if (state.currentBatch) {
      const updatedRides = state.currentBatch.rides.map((r) =>
        r.id === rideId ? { ...r, status: "in_progress" as const } : r
      );
      set({
        completedWaypoints: updated,
        currentBatch: { ...state.currentBatch, rides: updatedRides },
      });
    } else {
      set({ completedWaypoints: updated });
    }
  },

  confirmDropoff: async (rideId: string) => {
    await post(`/api/v1/rides/${rideId}/dropoff`);
    const state = getState();
    const key = `dropoff_${rideId}`;
    const updated = new Set(state.completedWaypoints);
    updated.add(key);

    if (state.currentBatch) {
      const updatedRides = state.currentBatch.rides.map((r) =>
        r.id === rideId ? { ...r, status: "completed" as const } : r
      );
      const allDone = updatedRides.every((r) => r.status === "completed" || r.status === "cancelled");
      set({
        completedWaypoints: updated,
        currentBatch: allDone ? null : { ...state.currentBatch, rides: updatedRides },
      });
    } else {
      set({ completedWaypoints: updated });
    }
  },

  completeBatch: () => {
    set({ currentBatch: null, completedWaypoints: new Set() });
  },

  reset: () => {
    stopLocationTracking();
    wsManager.disconnect();
    set({
      isOnline: false,
      destination: null,
      currentBatch: null,
      pendingBatch: null,
      completedWaypoints: new Set(),
      isLoading: false,
    });
  },
}));
