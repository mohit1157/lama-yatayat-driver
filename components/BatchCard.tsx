/**
 * Batch request card — shows matched riders and accept/decline buttons
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/config";
import type { Batch } from "@/lib/types";

interface BatchCardProps {
  batch: Batch;
  onAccept: () => void;
  onDecline: () => void;
  isLoading: boolean;
}

export default function BatchCard({
  batch,
  onAccept,
  onDecline,
  isLoading,
}: BatchCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Batch Request</Text>
        <Text style={styles.riderCount}>
          {batch.rides.length} rider{batch.rides.length > 1 ? "s" : ""}
        </Text>
      </View>

      <ScrollView
        style={styles.riderList}
        showsVerticalScrollIndicator={false}
      >
        {batch.rides.map((ride) => (
          <View key={ride.id} style={styles.riderRow}>
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>{ride.rider.name}</Text>
              <Text style={styles.riderRoute} numberOfLines={1}>
                {ride.pickup_location.address}
              </Text>
              <Text style={styles.riderDest} numberOfLines={1}>
                {ride.dropoff_location.address}
              </Text>
            </View>
            <Text style={styles.fare}>
              ${ride.fare.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.earningsRow}>
        <Text style={styles.earningsLabel}>Your Earnings</Text>
        <Text style={styles.earningsAmount}>
          ${batch.driver_earnings.toFixed(2)}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.declineBtn]}
          onPress={onDecline}
          disabled={isLoading}
        >
          <Text style={styles.declineBtnText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.acceptBtn]}
          onPress={onAccept}
          disabled={isLoading}
        >
          <Text style={styles.acceptBtnText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
  },
  riderCount: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riderList: {
    maxHeight: 180,
  },
  riderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  riderInfo: {
    flex: 1,
    marginRight: 12,
  },
  riderName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark,
  },
  riderRoute: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  riderDest: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 1,
  },
  fare: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.dark,
  },
  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
  },
  earningsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
  },
  earningsAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  declineBtn: {
    backgroundColor: Colors.lightBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  declineBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
  },
  acceptBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
});
