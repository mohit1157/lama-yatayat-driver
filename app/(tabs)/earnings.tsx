/**
 * Driver Earnings Screen
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/config";
import { get } from "@/services/api";
import EarningsChart from "@/components/EarningsChart";
import type { EarningsSummary, EarningsEntry } from "@/lib/types";

export default function EarningsScreen() {
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [recentTrips, setRecentTrips] = useState<EarningsEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEarnings = async () => {
    try {
      const [summaryData, tripsData] = await Promise.all([
        get<EarningsSummary>("/api/v1/payments/earnings/summary"),
        get<EarningsEntry[]>("/api/v1/payments/earnings/recent"),
      ]);
      setSummary(summaryData);
      setRecentTrips(tripsData ?? []);
    } catch (err) {
      // API may not have earnings endpoints yet – use defaults silently
      setSummary(null);
      setRecentTrips([]);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEarnings();
    setRefreshing(false);
  };

  // Mock weekly data for chart
  const weeklyData = [
    { day: "Mon", amount: 45 },
    { day: "Tue", amount: 62 },
    { day: "Wed", amount: 38 },
    { day: "Thu", amount: 55 },
    { day: "Fri", amount: 78 },
    { day: "Sat", amount: 90 },
    { day: "Sun", amount: 42 },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today</Text>
          <Text style={styles.summaryAmount}>
            ${summary?.today.toFixed(2) ?? "0.00"}
          </Text>
          <Text style={styles.summaryMeta}>
            {summary?.total_rides_today ?? 0} rides
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>This Week</Text>
          <Text style={styles.summaryAmount}>
            ${summary?.this_week.toFixed(2) ?? "0.00"}
          </Text>
          <Text style={styles.summaryMeta}>
            {summary?.total_rides_week ?? 0} rides
          </Text>
        </View>
      </View>

      {/* Avg per ride */}
      <View style={styles.avgCard}>
        <Ionicons name="trending-up" size={20} color={Colors.primary} />
        <Text style={styles.avgLabel}>Avg per ride</Text>
        <Text style={styles.avgAmount}>
          ${summary?.avg_per_ride.toFixed(2) ?? "0.00"}
        </Text>
      </View>

      {/* Weekly chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <EarningsChart data={weeklyData} />
      </View>

      {/* Recent trips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Trips</Text>
        {recentTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={40} color={Colors.grayLight} />
            <Text style={styles.emptyText}>No trips yet</Text>
          </View>
        ) : (
          recentTrips.map((entry, index) => (
            <View key={entry.id ?? index} style={styles.tripRow}>
              <View>
                <Text style={styles.tripId}>
                  Trip #{(entry.ride_id ?? entry.id ?? "—").slice(0, 8)}
                </Text>
                <Text style={styles.tripDate}>
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleDateString()
                    : "—"}
                </Text>
              </View>
              <Text style={styles.tripAmount}>
                +${(entry.amount ?? 0).toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    marginTop: 4,
  },
  summaryMeta: {
    fontSize: 12,
    color: Colors.grayLight,
    marginTop: 4,
  },
  avgCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
  },
  avgLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
    fontWeight: "500",
  },
  avgAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.grayLight,
    marginTop: 8,
  },
  tripRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  tripId: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
  },
  tripDate: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  tripAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
});
