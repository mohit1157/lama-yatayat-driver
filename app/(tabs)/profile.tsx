/**
 * Driver Profile Screen
 */

import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/config";
import { useAuthStore } from "@/stores/auth";
import { useDriverStore } from "@/stores/driver";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, driverProfile, logout, fetchDriverProfile } = useAuthStore();
  const { reset } = useDriverStore();

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          reset();
          await logout();
        },
      },
    ]);
  };

  const statusColor = {
    pending: Colors.warning,
    approved: Colors.success,
    rejected: Colors.danger,
    suspended: Colors.danger,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Driver info */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={Colors.white} />
        </View>
        <Text style={styles.name}>{user?.name ?? "Driver"}</Text>
        <Text style={styles.email}>{user?.email ?? ""}</Text>

        {driverProfile && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={Colors.warning} />
            <Text style={styles.rating}>
              {driverProfile.rating_avg.toFixed(1)} ({driverProfile.rating_count}{" "}
              ratings)
            </Text>
          </View>
        )}

        {driverProfile && (
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusColor[driverProfile.bg_check_status] + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusColor[driverProfile.bg_check_status] },
              ]}
            >
              {driverProfile.bg_check_status.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Vehicle info */}
      {driverProfile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          <View style={styles.infoCard}>
            <InfoRow
              icon="car"
              label="Vehicle"
              value={`${driverProfile.vehicle_color} ${driverProfile.vehicle_make} ${driverProfile.vehicle_model}`}
            />
            <InfoRow
              icon="calendar"
              label="Year"
              value={String(driverProfile.vehicle_year)}
            />
            <InfoRow
              icon="pricetag"
              label="Plate"
              value={driverProfile.vehicle_plate}
            />
            <InfoRow
              icon="document-text"
              label="License"
              value={driverProfile.license_number}
            />
            <InfoRow
              icon="people"
              label="Capacity"
              value={`${driverProfile.capacity} passengers`}
            />
          </View>
        </View>
      )}

      {/* Contact info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.infoCard}>
          <InfoRow
            icon="mail"
            label="Email"
            value={user?.email ?? ""}
          />
          <InfoRow
            icon="call"
            label="Phone"
            value={user?.phone ?? ""}
          />
        </View>
      </View>

      {/* Actions */}
      {!driverProfile && (
        <TouchableOpacity
          style={styles.onboardBtn}
          onPress={() => router.push("/status/pending")}
        >
          <Text style={styles.onboardBtnText}>Complete Onboarding</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon as any}
        size={18}
        color={Colors.gray}
      />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  profileCard: {
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark,
  },
  email: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  rating: {
    fontSize: 14,
    color: Colors.dark,
    fontWeight: "500",
  },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
  },
  onboardBtn: {
    marginHorizontal: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  onboardBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.danger,
    fontWeight: "600",
  },
});
