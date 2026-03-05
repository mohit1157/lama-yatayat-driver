/**
 * Active Trip Screen
 *
 * Shows map with multi-stop waypoints and pickup/dropoff confirmation.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/config";
import { useDriverStore } from "@/stores/driver";
import { useLocationStore } from "@/stores/location";
import WaypointList from "@/components/WaypointList";
import type { Waypoint } from "@/lib/types";

let MapView: any;
let Marker: any;
try {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
} catch {
  MapView = null;
  Marker = null;
}

export default function ActiveTripScreen() {
  const router = useRouter();
  const {
    currentBatch,
    completedWaypoints,
    confirmPickup,
    confirmDropoff,
    completeBatch,
  } = useDriverStore();
  const { currentLocation, fetchCurrentLocation } = useLocationStore();
  const [isConfirming, setIsConfirming] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  // Delay MapView rendering to avoid blank map on mount
  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Animate map to current location when it changes
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500
      );
    }
  }, [currentLocation]);

  // If no current batch, go back
  useEffect(() => {
    if (!currentBatch) {
      router.replace("/trip/complete");
    }
  }, [currentBatch]);

  if (!currentBatch) return null;

  // Build waypoints from batch rides
  const waypoints: Waypoint[] = [];
  let order = 0;
  // Pickups first
  currentBatch.rides.forEach((ride) => {
    waypoints.push({
      ride_id: ride.id,
      rider_name: ride.rider.name,
      type: "pickup",
      lat: ride.pickup_location.lat,
      lng: ride.pickup_location.lng,
      address: ride.pickup_location.address,
      completed: completedWaypoints.has(`pickup_${ride.id}`),
      order: order++,
    });
  });
  // Then dropoffs
  currentBatch.rides.forEach((ride) => {
    waypoints.push({
      ride_id: ride.id,
      rider_name: ride.rider.name,
      type: "dropoff",
      lat: ride.dropoff_location.lat,
      lng: ride.dropoff_location.lng,
      address: ride.dropoff_location.address,
      completed: completedWaypoints.has(`dropoff_${ride.id}`),
      order: order++,
    });
  });

  // Use batch waypoints if provided, otherwise use generated ones
  const displayWaypoints =
    currentBatch.waypoints?.length > 0 ? currentBatch.waypoints : waypoints;

  const handleConfirmWaypoint = async (wp: Waypoint) => {
    setIsConfirming(true);
    try {
      if (wp.type === "pickup") {
        await confirmPickup(wp.ride_id);
      } else {
        await confirmDropoff(wp.ride_id);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed";
      Alert.alert("Error", message);
    }
    setIsConfirming(false);
  };

  const allDone = displayWaypoints.every((wp) =>
    completedWaypoints.has(`${wp.type}_${wp.ride_id}`)
  );

  const region = currentLocation
    ? {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: displayWaypoints[0]?.lat ?? 27.7172,
        longitude: displayWaypoints[0]?.lng ?? 85.324,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      {/* Map with waypoint markers */}
      <View style={styles.mapContainer}>
        {MapView && mapReady ? (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton={true}
          >
            {displayWaypoints.map((wp) => {
              const key = `${wp.type}_${wp.ride_id}`;
              const done = completedWaypoints.has(key);
              return (
                Marker && (
                  <Marker
                    key={key}
                    coordinate={{ latitude: wp.lat, longitude: wp.lng }}
                    title={`${wp.type === "pickup" ? "Pick up" : "Drop off"} ${wp.rider_name}`}
                    pinColor={
                      done
                        ? "#9CA3AF"
                        : wp.type === "pickup"
                        ? "#2563EB"
                        : "#059669"
                    }
                  />
                )
              );
            })}
          </MapView>
        ) : (
          <View style={[StyleSheet.absoluteFillObject, styles.mapPlaceholder]}>
            <Ionicons name="map" size={48} color={Colors.grayLight} />
          </View>
        )}
      </View>

      {/* Bottom sheet with waypoints */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>
          Active Trip - {currentBatch.rides.length} rider
          {currentBatch.rides.length > 1 ? "s" : ""}
        </Text>

        <ScrollView style={styles.waypointScroll}>
          <WaypointList
            waypoints={displayWaypoints}
            completedKeys={completedWaypoints}
            onConfirm={handleConfirmWaypoint}
            isLoading={isConfirming}
          />
        </ScrollView>

        {allDone && (
          <TouchableOpacity
            style={styles.completeBtn}
            onPress={() => {
              completeBatch();
              router.replace("/trip/complete");
            }}
          >
            <Text style={styles.completeBtnText}>Complete Trip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightBg,
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    maxHeight: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 8,
  },
  waypointScroll: {
    maxHeight: 250,
  },
  completeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  completeBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
});
