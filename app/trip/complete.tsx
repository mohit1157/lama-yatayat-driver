/**
 * Trip Complete Screen
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/config";

export default function TripCompleteScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Trip Completed!</Text>
        <Text style={styles.subtitle}>
          Great job! Your earnings have been updated.
        </Text>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Trip Earnings</Text>
          <Text style={styles.earningsAmount}>Calculated</Text>
          <Text style={styles.earningsMeta}>
            Check your earnings tab for details
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.earningsBtn}
          onPress={() => router.replace("/(tabs)/earnings")}
        >
          <Text style={styles.earningsBtnText}>View Earnings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.dark,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.gray,
    marginTop: 8,
    textAlign: "center",
  },
  earningsCard: {
    backgroundColor: Colors.lightBg,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 32,
    width: "100%",
  },
  earningsLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
    marginTop: 4,
  },
  earningsMeta: {
    fontSize: 12,
    color: Colors.grayLight,
    marginTop: 6,
  },
  homeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginTop: 32,
    width: "100%",
    alignItems: "center",
  },
  homeBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  earningsBtn: {
    paddingVertical: 16,
    marginTop: 12,
  },
  earningsBtnText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
});
