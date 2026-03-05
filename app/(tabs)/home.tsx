/**
 * Driver Home Screen
 *
 * Full-screen map with online/offline toggle.
 * When online, shows destination input and waiting for riders.
 * Receives batch requests via WebSocket.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, DEFAULT_REGION } from "@/constants/config";
import { useAuthStore } from "@/stores/auth";
import { useDriverStore } from "@/stores/driver";
import { useLocationStore } from "@/stores/location";
import { wsManager } from "@/services/websocket";
import { registerForPushNotifications } from "@/services/notifications";
import OnlineToggle from "@/components/OnlineToggle";
import BatchCard from "@/components/BatchCard";
import type { Batch } from "@/lib/types";

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

export default function DriverHomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    isOnline,
    isLoading,
    pendingBatch,
    currentBatch,
    goOnline,
    goOffline,
    setPendingBatch,
    acceptBatch,
    declineBatch,
  } = useDriverStore();
  const { currentLocation, fetchCurrentLocation, requestPermission } =
    useLocationStore();

  const [destinationInput, setDestinationInput] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);

  // Request location on mount
  useEffect(() => {
    (async () => {
      await requestPermission();
      await fetchCurrentLocation();
    })();
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
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500
      );
    }
  }, [currentLocation]);

  // Register push notifications
  useEffect(() => {
    if (user) {
      registerForPushNotifications();
    }
  }, [user]);

  // Listen for batch requests via WebSocket
  useEffect(() => {
    const handleBatchRequest = (data: unknown) => {
      setPendingBatch(data as Batch);
    };

    wsManager.on("batch_request", handleBatchRequest);
    return () => {
      wsManager.off("batch_request", handleBatchRequest);
    };
  }, []);

  // Navigate to active trip when batch is accepted
  useEffect(() => {
    if (currentBatch) {
      router.push("/trip/active");
    }
  }, [currentBatch]);

  const handleToggle = async () => {
    if (!user) return;
    try {
      if (isOnline) {
        await goOffline(user.id);
      } else {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Location Required",
            "Please enable location services to go online."
          );
          return;
        }
        await goOnline(user.id);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      Alert.alert("Error", message);
    }
  };

  const handleAcceptBatch = async () => {
    if (!pendingBatch) return;
    await acceptBatch(pendingBatch.id);
  };

  const handleDeclineBatch = async () => {
    if (!pendingBatch) return;
    await declineBatch(pendingBatch.id);
  };

  const region = currentLocation
    ? {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : DEFAULT_REGION;

  return (
    <View style={styles.container}>
      {/* Map */}
      {MapView && mapReady ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={true}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.mapPlaceholder]}>
          <Ionicons name="map" size={64} color={Colors.grayLight} />
          <Text style={styles.mapPlaceholderText}>Map</Text>
        </View>
      )}

      {/* Top status bar */}
      <View style={styles.topBar}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            {isOnline ? "You're Online" : "You're Offline"}
          </Text>
          {isOnline && !currentBatch && (
            <Text style={styles.waitingText}>Waiting for riders...</Text>
          )}
        </View>
      </View>

      {/* Destination input (when online) */}
      {isOnline && !pendingBatch && !currentBatch && (
        <View style={styles.destinationBar}>
          <Ionicons
            name="navigate"
            size={20}
            color={Colors.primary}
          />
          <TextInput
            style={styles.destinationInput}
            placeholder="Set your destination (optional)"
            placeholderTextColor={Colors.grayLight}
            value={destinationInput}
            onChangeText={setDestinationInput}
          />
        </View>
      )}

      {/* Pending batch card */}
      {pendingBatch && (
        <View style={styles.batchOverlay}>
          <BatchCard
            batch={pendingBatch}
            onAccept={handleAcceptBatch}
            onDecline={handleDeclineBatch}
            isLoading={isLoading}
          />
        </View>
      )}

      {/* Online/Offline toggle */}
      {!pendingBatch && !currentBatch && (
        <View style={styles.toggleContainer}>
          <OnlineToggle
            isOnline={isOnline}
            isLoading={isLoading}
            onToggle={handleToggle}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  mapPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightBg,
  },
  mapPlaceholderText: {
    color: Colors.grayLight,
    marginTop: 8,
    fontSize: 16,
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {},
  greetingText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
  },
  waitingText: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
  },
  destinationBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 140 : 120,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  destinationInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
  },
  batchOverlay: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
  },
  toggleContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
  },
});
