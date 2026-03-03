/**
 * Ordered waypoint list for active trip (pickups then dropoffs)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/config";
import type { Waypoint } from "@/lib/types";

interface WaypointListProps {
  waypoints: Waypoint[];
  completedKeys: Set<string>;
  onConfirm: (waypoint: Waypoint) => void;
  isLoading?: boolean;
}

export default function WaypointList({
  waypoints,
  completedKeys,
  onConfirm,
  isLoading,
}: WaypointListProps) {
  const sorted = [...waypoints].sort((a, b) => a.order - b.order);

  return (
    <View style={styles.container}>
      {sorted.map((wp, index) => {
        const key = `${wp.type}_${wp.ride_id}`;
        const isCompleted = completedKeys.has(key);
        const isNext =
          !isCompleted &&
          sorted
            .slice(0, index)
            .every((prev) => completedKeys.has(`${prev.type}_${prev.ride_id}`));

        return (
          <View key={key} style={styles.row}>
            <View style={styles.iconCol}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  wp.type === "pickup" ? styles.dotPickup : styles.dotDropoff,
                ]}
              >
                <Ionicons
                  name={
                    isCompleted
                      ? "checkmark"
                      : wp.type === "pickup"
                      ? "arrow-up"
                      : "arrow-down"
                  }
                  size={14}
                  color={Colors.white}
                />
              </View>
              {index < sorted.length - 1 && <View style={styles.line} />}
            </View>

            <View style={styles.content}>
              <Text style={[styles.label, isCompleted && styles.labelDone]}>
                {wp.type === "pickup" ? "Pick up" : "Drop off"}{" "}
                {wp.rider_name}
              </Text>
              <Text
                style={[styles.address, isCompleted && styles.addressDone]}
                numberOfLines={1}
              >
                {wp.address}
              </Text>
            </View>

            {isNext && !isCompleted && (
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => onConfirm(wp)}
                disabled={isLoading}
              >
                <Text style={styles.confirmText}>
                  {wp.type === "pickup" ? "Picked Up" : "Dropped Off"}
                </Text>
              </TouchableOpacity>
            )}

            {isCompleted && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Colors.success}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 60,
  },
  iconCol: {
    width: 32,
    alignItems: "center",
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dotPickup: {
    backgroundColor: Colors.accent,
  },
  dotDropoff: {
    backgroundColor: Colors.primary,
  },
  dotCompleted: {
    backgroundColor: Colors.grayLight,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  content: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
  },
  labelDone: {
    color: Colors.grayLight,
    textDecorationLine: "line-through",
  },
  address: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  addressDone: {
    color: Colors.grayLight,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
});
