import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  Modal,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../src/services/api";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Campaign {
  id: number;
  name: string;
}

interface Session {
  id: number;
  id_campaign: number;
  observation?: string;
  date: string;
}

export default function CharactersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ campaignId?: string }>();
  const campaignId = Number(params.campaignId) || null;

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [newSession, setNewSession] = useState({
    id_campaign: campaignId,
    observation: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [sessionVisible, setSessionVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);

      const campaign = await api.get(`/campaign/${campaignId}`);
      setCurrentCampaign(campaign.datos);

      const res = await api.get(`/session/campaign/${campaignId}`);
      setSessions(res.datos || []);
    } catch (err) {
      console.log("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async () => {
    try {
      if (editingSession) {
        // ✏️ UPDATE
        await api.put(`/session/${editingSession.id}`, newSession);
      } else {
        // ➕ CREATE
        await api.post(`/session`, {
          ...newSession,
          id_campaign: campaignId,
        });
        await api.put(`/campaign/${campaignId}`,{next_session:newSession.date})
      }

      resetForm();
      fetchSessions();
    } catch (err) {
      console.log("Error saving session:", err);
    }
  };

  const resetForm = () => {
    setNewSession({
      id_campaign: campaignId,
      observation: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingSession(null);
    setSessionVisible(false);
  };

  const openEdit = (session: Session) => {
    setEditingSession(session);
    setNewSession({
      id_campaign: session.id_campaign,
      observation: session.observation || "",
      date: session.date,
    });
    setSessionVisible(true);
  };

  useEffect(() => {
    if (campaignId !== null) fetchSessions();
  }, [campaignId]);

  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={{ flex: 1, padding: 16 }}
    >
      {/* TOPBAR */}
      <View style={{
        backgroundColor: "#1e3a5f",
        borderWidth: 3,
        borderColor: "#2a4563",
        padding: 8,
        borderRadius: 4,
        marginBottom: 16,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color="#00d9ff" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: "#00d9ff", fontSize: 28, fontWeight: "bold" }}>
              {currentCampaign?.name || "DigiMastery"}
            </Text>
            <Text style={{ color: "#ffa500" }}>SESSIONS</Text>
          </View>

          <View style={{ width: 20 }} />
        </View>
      </View>

      {/* ADD BUTTON */}
      <TouchableOpacity
        onPress={() => {
          setEditingSession(null);
          setSessionVisible(true);
        }}
        style={{
          backgroundColor: "#00d9ff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          ADD SESSION
        </Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#00ff88",
              padding: 12,
              borderRadius: 6,
              marginBottom: 8,
              position: "relative",
            }}
          >
            {/* ✏️ EDIT ICON */}
            <TouchableOpacity
              onPress={() => openEdit(item)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <Feather name="edit" size={16} color="#00d9ff" />
            </TouchableOpacity>

            <Text style={{ color: "#ffa500", fontSize: 12 }}>DATE</Text>
            <Text style={{ color: "#fff" }}>{item.date}</Text>

            <Text style={{ color: "#ffa500", marginTop: 10, fontSize: 12 }}>
              OBSERVATIONS
            </Text>
            <Text style={{ color: "#fff" }}>
              {item.observation || "-"}
            </Text>
          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={sessionVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingSession ? "Edit Session" : "Add Session"}
            </Text>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={newSession.date}
                onChange={(e) =>
                  setNewSession((d) => ({ ...d, date: e.target.value }))
                }
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  <Text>{newSession.date}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    onChange={(e, date) => {
                      setShowDatePicker(false);
                      if (date) {
                        setNewSession((d) => ({
                          ...d,
                          date: date.toISOString().split("T")[0],
                        }));
                      }
                    }}
                  />
                )}
              </>
            )}

            <TextInput
              placeholder="Observations"
              value={newSession.observation}
              onChangeText={(t) =>
                setNewSession((d) => ({ ...d, observation: t }))
              }
              style={styles.input}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancel" onPress={resetForm} />
              <Button title="Save" onPress={saveSession} />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
  },
  modalBox: {
    backgroundColor: "#1e2a4a",
    padding: 16,
    borderRadius: 12,
  },
  modalTitle: {
    color: "#0ff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});