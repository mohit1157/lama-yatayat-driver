/**
 * Online/Offline toggle switch for drivers
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/config";

interface OnlineToggleProps {
  isOnline: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export default function OnlineToggle({
  isOnline,
  isLoading,
  onToggle,
}: OnlineToggleProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isOnline ? styles.online : styles.offline,
      ]}
      onPress={onToggle}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <>
          <View
            style={[
              styles.indicator,
              { backgroundColor: isOnline ? "#34D399" : "#FCA5A5" },
            ]}
          />
          <Text style={styles.text}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    minWidth: 140,
  },
  online: {
    backgroundColor: Colors.primary,
  },
  offline: {
    backgroundColor: Colors.dark,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
