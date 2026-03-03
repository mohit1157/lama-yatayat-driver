/**
 * LaMa Yatayat Driver - Push Notification Registration
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { post } from "./api";
import type { PushTokenPayload } from "@/lib/types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // Register token with backend
    const payload: PushTokenPayload = {
      token,
      platform: Platform.OS as "ios" | "android",
    };
    await post("/api/v1/notifications/token", payload);

    return token;
  } catch {
    return null;
  }
}
