/**
 * Simple weekly earnings bar display
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/config";

interface EarningsChartProps {
  data: { day: string; amount: number }[];
}

export default function EarningsChart({ data }: EarningsChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {data.map((item) => (
          <View key={item.day} style={styles.barCol}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: `${(item.amount / maxAmount) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.dayLabel}>{item.day}</Text>
            <Text style={styles.amountLabel}>
              ${item.amount.toFixed(0)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  bars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
  },
  barCol: {
    alignItems: "center",
    flex: 1,
  },
  barTrack: {
    width: 24,
    height: 100,
    backgroundColor: Colors.lightBg,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 6,
    fontWeight: "500",
  },
  amountLabel: {
    fontSize: 10,
    color: Colors.dark,
    fontWeight: "600",
    marginTop: 2,
  },
});
