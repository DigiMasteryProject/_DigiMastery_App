import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  TouchableOpacity
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Calendar } from "react-native-calendars";
import { scheduleSessionNotifications } from "../utils/notifications";
import api from "../src/services/api";
import Feather from "@expo/vector-icons/build/Feather";

interface Session {
  id: number;
  id_campaign: number;
  date: string;
  observation: string;
}

interface Campaign {
  id: number;
  name: string;
}

type EnrichedSession = {
  name: string;
  observation: string;
  sessionNumber: number;
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const getUserId = async () => {
    try {
      let userData =
        Platform.OS === "web"
          ? localStorage.getItem("user")
          : await SecureStore.getItemAsync("user");

      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUserId(user.id);
      }
    } catch (err) {
      console.log("Error leyendo usuario:", err);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  const fetchData = async () => {
    try {
      if (!currentUserId) return;

      const userCampaignsRes = await api.get(
        `/user_campaign?user=${currentUserId}`
      );

      const campaignsRes = await api.get("/campaign");
      const sessionsRes = await api.get("/session");

      const userCampaigns = userCampaignsRes?.datos ?? [];

      const campaignIds = Array.isArray(userCampaigns)
        ? userCampaigns.map((uc: any) => uc.id_campaign)
        : [];

      const campaignsData = campaignsRes?.datos ?? campaignsRes?.data ?? [];
      const sessionsData = sessionsRes?.datos ?? sessionsRes?.data ?? [];

      const filteredCampaigns = campaignsData.filter((c: Campaign) =>
        campaignIds.includes(c.id)
      );

      const filteredSessions = sessionsData.filter((s: Session) =>
        campaignIds.includes(s.id_campaign)
      );

      const normalizedSessions = filteredSessions.map((s: Session) => ({
        ...s,
        date: s.date.split("T")[0],
      }));

      setCampaigns(filteredCampaigns);
      setSessions(normalizedSessions);

      setSelectedDate(normalizedSessions?.[0]?.date || "");
    } catch (err) {
      console.log("Error calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId !== null) {
      fetchData();
    }
  }, [currentUserId]);

  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, EnrichedSession[]> = {};

    sessions.forEach((session) => {
      const campaign = campaigns.find(
        (c) => c.id === session.id_campaign
      );

      const sessionsOfCampaign = sessions.filter(
        (s) => s.id_campaign === session.id_campaign
      );

      const sorted = [...sessionsOfCampaign].sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      const sessionNumber =
        sorted.findIndex((s) => s.id === session.id) + 1;

      if (!grouped[session.date]) grouped[session.date] = [];

      grouped[session.date].push({
        name: campaign?.name || "Unknown Campaign",
        observation: session.observation,
        sessionNumber,
      });
    });

    return grouped;
  }, [sessions, campaigns]);

  const markedDates = useMemo(() => {
    const marked: any = {};
    const today = new Date().toISOString().split("T")[0];

    Object.keys(sessionsByDate).forEach((date) => {
      const isPast = date < today;

      marked[date] = {
        marked: true,
        dotColor: isPast ? "#00ff88" : "#ff3b3b",
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: "#00d9ff",
      };
    }

    return marked;
  }, [sessionsByDate, selectedDate]);

  useEffect(() => {
    const setupNotifications = async () => {
      for (const session of sessions) {
        const campaign = campaigns.find(
          (c) => c.id === session.id_campaign
        );

        if (campaign) {
          await scheduleSessionNotifications(
            session.date,
            campaign.name
          );
        }
      }
    };

    if (sessions.length && campaigns.length) {
      setupNotifications();
    }
  }, [sessions, campaigns]);

  const selectedSessions = sessionsByDate[selectedDate] || [];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#00d9ff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Loading calendar...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        markingType="dot"
        theme={{
          backgroundColor: "#0a0e1f",
          calendarBackground: "#0a0e1f",
          dayTextColor: "#fff",
          monthTextColor: "#00d9ff",
          arrowColor: "#ffa500",
          selectedDayBackgroundColor: "#00d9ff",
          selectedDayTextColor: "#000",
        }}
      />

      <View style={styles.listContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={styles.title}>
            Sessions on {selectedDate || "—"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Feather name="arrow-left" size={18} color="#00d9ff" />
            <Text style={{ color: "#00d9ff", marginLeft: 4, fontWeight: "bold" }}>
              BACK
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={selectedSessions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.campaign}>{item.name}</Text>
              <Text style={styles.session}>
                Session #{item.sessionNumber}
              </Text>
              <Text style={styles.obs}>{item.observation}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No sessions for this day
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e1f",
  },

  listContainer: {
    flex: 1,
    padding: 12,
  },

  title: {
    color: "#00d9ff",
    fontSize: 14,
    marginVertical: 10,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#1e5a8e",
    borderWidth: 2,
    borderColor: "#2a4563",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },

  campaign: {
    color: "#00d9ff",
    fontWeight: "bold",
  },

  session: {
    color: "#ffa500",
    marginTop: 4,
  },

  obs: {
    color: "#fff",
    marginTop: 6,
    opacity: 0.8,
  },

  empty: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    opacity: 0.6,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});