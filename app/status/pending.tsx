/**
 * Driver Onboarding / Pending Approval Screen
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/config";
import { useAuthStore } from "@/stores/auth";
import type { OnboardInput } from "@/lib/types";

export default function PendingScreen() {
  const router = useRouter();
  const { driverProfile, onboard, isLoading } = useAuthStore();
  const [form, setForm] = useState<OnboardInput>({
    license_number: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: new Date().getFullYear(),
    vehicle_plate: "",
    vehicle_color: "",
    capacity: 4,
  });

  const handleSubmit = async () => {
    if (
      !form.license_number.trim() ||
      !form.vehicle_make.trim() ||
      !form.vehicle_model.trim() ||
      !form.vehicle_plate.trim() ||
      !form.vehicle_color.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await onboard(form);
      Alert.alert(
        "Submitted",
        "Your application has been submitted for review.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)/home") }]
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Submission failed";
      Alert.alert("Error", message);
    }
  };

  // Already onboarded but pending
  if (driverProfile && driverProfile.bg_check_status === "pending") {
    return (
      <View style={styles.pendingContainer}>
        <Ionicons name="time" size={64} color={Colors.warning} />
        <Text style={styles.pendingTitle}>Application Under Review</Text>
        <Text style={styles.pendingSubtitle}>
          Your driver application is being reviewed. You'll be notified once
          approved.
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Vehicle Onboarding</Text>
      <Text style={styles.subtitle}>
        Enter your vehicle and license details to get started
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>License Number</Text>
        <TextInput
          style={styles.input}
          placeholder="DL-123456"
          placeholderTextColor={Colors.grayLight}
          value={form.license_number}
          onChangeText={(v) => setForm({ ...form, license_number: v })}
        />

        <Text style={styles.label}>Vehicle Make</Text>
        <TextInput
          style={styles.input}
          placeholder="Toyota"
          placeholderTextColor={Colors.grayLight}
          value={form.vehicle_make}
          onChangeText={(v) => setForm({ ...form, vehicle_make: v })}
        />

        <Text style={styles.label}>Vehicle Model</Text>
        <TextInput
          style={styles.input}
          placeholder="Corolla"
          placeholderTextColor={Colors.grayLight}
          value={form.vehicle_model}
          onChangeText={(v) => setForm({ ...form, vehicle_model: v })}
        />

        <Text style={styles.label}>Vehicle Year</Text>
        <TextInput
          style={styles.input}
          placeholder="2022"
          placeholderTextColor={Colors.grayLight}
          keyboardType="numeric"
          value={String(form.vehicle_year)}
          onChangeText={(v) =>
            setForm({ ...form, vehicle_year: parseInt(v) || 2022 })
          }
        />

        <Text style={styles.label}>License Plate</Text>
        <TextInput
          style={styles.input}
          placeholder="BA-1234"
          placeholderTextColor={Colors.grayLight}
          autoCapitalize="characters"
          value={form.vehicle_plate}
          onChangeText={(v) => setForm({ ...form, vehicle_plate: v })}
        />

        <Text style={styles.label}>Vehicle Color</Text>
        <TextInput
          style={styles.input}
          placeholder="White"
          placeholderTextColor={Colors.grayLight}
          value={form.vehicle_color}
          onChangeText={(v) => setForm({ ...form, vehicle_color: v })}
        />

        <Text style={styles.label}>Passenger Capacity</Text>
        <TextInput
          style={styles.input}
          placeholder="4"
          placeholderTextColor={Colors.grayLight}
          keyboardType="numeric"
          value={String(form.capacity)}
          onChangeText={(v) =>
            setForm({ ...form, capacity: parseInt(v) || 4 })
          }
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.dark,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
    marginBottom: 24,
  },
  form: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.darkSecondary,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.dark,
    backgroundColor: Colors.lightBg,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  pendingContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  pendingTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.dark,
    marginTop: 24,
  },
  pendingSubtitle: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  backBtn: {
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: Colors.lightBg,
    borderRadius: 12,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
  },
});
