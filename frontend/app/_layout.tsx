import { Slot, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform, View, ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      let user = null;

      if (Platform.OS === "web") {
        user = localStorage.getItem("user");
      } else {
        user = await SecureStore.getItemAsync("user");
      }

      setReady(true);

      if (!user) {
        // 🔥 IMPORTANTE: retrasar navegación
        setTimeout(() => {
          router.replace("/login");
        }, 0);
      }

      setLoading(false);
    };

    checkLogin();
  }, []);

  if (loading || !ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}