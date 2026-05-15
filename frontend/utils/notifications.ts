import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function scheduleSessionNotifications(
  date: Date,
  campaignName: string
) {
  if (Platform.OS === "web") return;

  const sessionDate = new Date(date);
  const now = new Date();

  const reminders = [7, 3, 1];

  for (const days of reminders) {
    const triggerDate = new Date(sessionDate);
    triggerDate.setDate(triggerDate.getDate() - days);

    if (triggerDate > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎮 Upcoming Session",
          body: `${campaignName} in ${days} day(s)`,
        },
        trigger: triggerDate as any, // ✅ FIX CLAVE
      });
    }
  }

  if (sessionDate > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Session Today",
        body: `${campaignName} is today!`,
      },
      trigger: sessionDate as any, // ✅ FIX CLAVE
    });
  }
}