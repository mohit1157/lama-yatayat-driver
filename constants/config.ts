/**
 * LaMa Yatayat Driver - App Configuration
 */

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://lama-yatayat-backend-production.up.railway.app";

export const WS_URL =
  process.env.EXPO_PUBLIC_WS_URL ??
  "wss://lama-yatayat-backend-production.up.railway.app";

export const Colors = {
  primary: "#059669",
  primaryLight: "#10B981",
  primaryDark: "#047857",
  accent: "#2563EB",
  accentLight: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  dangerLight: "#FCA5A5",
  dark: "#1F2937",
  darkSecondary: "#374151",
  gray: "#6B7280",
  grayLight: "#9CA3AF",
  border: "#E5E7EB",
  lightBg: "#F9FAFB",
  white: "#FFFFFF",
  online: "#10B981",
  offline: "#EF4444",
} as const;

/** Map default region (Kathmandu, Nepal) */
export const DEFAULT_REGION = {
  latitude: 27.7172,
  longitude: 85.324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

/** Location tracking interval in milliseconds */
export const LOCATION_UPDATE_INTERVAL = 5000;
