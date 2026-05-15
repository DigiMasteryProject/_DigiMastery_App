import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export default function useAdminGuard() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const verify = async () => {

      try {

        let user = null;

        if (Platform.OS === "web") {

          const stored =
            localStorage.getItem("user");

          user = stored ? JSON.parse(stored) : null;

        } else {

          const stored =
            await SecureStore.getItemAsync("user");

          user = stored ? JSON.parse(stored) : null;
        }

        if (!user || user.role !== "ADMIN") {
          router.replace("/");
          return;
        }

      } catch (err) {

        console.log("Admin guard error:", err);

        router.replace("/");

      } finally {

        setLoading(false);
      }
    };

    verify();

  }, []);

  return loading;
}