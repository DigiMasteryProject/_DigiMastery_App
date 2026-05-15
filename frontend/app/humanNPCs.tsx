import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  StyleSheet,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Feather } from "@expo/vector-icons";
import api from "../src/services/api";
import { getHumanArchetype } from "../src/components/human/HumanArchetypeCalc";

/* ================= TYPES ================= */

interface Human {
  id: number;
  name: string;
  archetype: string;
  darkness: number;

  courage: number;
  skill: number;
  intelligence: number;
  serenity: number;
  perception: number;
  strength: number;
}

interface HumanNPC {
  id: number;
  id_campaign: number;
  id_human: number;
  human: Human;
}

/* ================= SCREEN ================= */

export default function HumanNPCsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ campaignId?: string }>();
  const campaignId = Number(params.campaignId);

  const [npcCampaign, setNpcCampaign] = useState<HumanNPC[]>([]);
  const [npcTest, setNpcTest] = useState<HumanNPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [createVisible, setCreateVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<number | null>(null);

  const [newHuman, setNewHuman] = useState({
    name: "",
    archetype: "",
    darkness: 0,
    courage: 0,
    skill: 0,
    intelligence: 0,
    serenity: 0,
    perception: 0,
    strength: 0,
    id_user: currentUser,
  });

   const getUserId = async () => {
      try {
        let userData =
          Platform.OS === "web"
            ? localStorage.getItem("user")
            : await SecureStore.getItemAsync("user");
  
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user.id);
        }
      } catch (err) {
        console.log("Error leyendo usuario:", err);
      }
    };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") window.alert(`${title}\n${message}`);
    else Alert.alert(title, message);
  };

  /* ================= FETCH NPCS ================= */

  const enrichHumanNPC = async (npc: HumanNPC) => {
  try {
    const human = await api.get(`/human/${npc.id_human}`);
    const humanData = human?.datos;

    if (!humanData) throw new Error("Human data not found");

    return {
      ...humanData,
    };
  } catch (err) {
    return {
      ...npc,
      human: {
        name: "-",
        archetype: "-",
        darkness: 0,
        courage: 0,
        skill: 0,
        intelligence: 0,
        serenity: 0,
        perception: 0,
        strength: 0,
      },
      stats: {
        courage: 0,
        skill: 0,
        intelligence: 0,
        serenity: 0,
        perception: 0,
        strength: 0,
        power: 0,
      },
    };
  }
};

  const fetchNPCs = useCallback(async () => {
    try {
      setLoading(true);
      if (!campaignId) return;

      const res1 = await api.get(`/npc/campaign/${campaignId}?type=human`);
      const res2 = await api.get(`/npc/campaign/1?type=human`);

      const listCampaign = Array.isArray(res1?.datos) ? res1.datos : [];
      const listTest = Array.isArray(res2?.datos) ? res2.datos : [];


      const enrichedCampaign = await Promise.all(
        listCampaign.map(enrichHumanNPC)
        );

      const enrichedTest = await Promise.all(
        listTest.map(enrichHumanNPC)
        );

        setNpcCampaign(enrichedCampaign);
        setNpcTest(enrichedTest);
    } catch (err) {
      console.log(err);
      showAlert("Error", "No se pudieron cargar NPCs humanos");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    getUserId();
    if (campaignId) fetchNPCs();
  }, [campaignId]);

  /* ================= CREATE ================= */

  const createHumanNPC = async () => {
    try {
      if (!newHuman.name) {
        showAlert("Error", "Nombre requerido");
        return;
      }

      newHuman.id_user = currentUser || 0;
      newHuman.archetype = getHumanArchetype({
        courage: newHuman.courage,
        skill: newHuman.skill,
        intelligence: newHuman.intelligence,
        serenity: newHuman.serenity,
        perception: newHuman.perception,
        strength: newHuman.strength,
      });
      const humanRes = await api.post("/human", newHuman);
      const created = humanRes?.datos;

      if (!created?.id) throw new Error("Human not created");

      await api.post("/npc", {
        id_campaign: campaignId,
        id_human: created.id,
        type: "human",
      });

      setCreateVisible(false);
      fetchNPCs();
    } catch (err) {
      console.log("Error creando NPC:", err);
      showAlert("Error", "No se pudo crear NPC humano");
    }
  };

  /* ================= RENDER CARD ================= */

  const renderNPC = (item: Human) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/human",
          params: { humanId: item.id },
        })
      }
      style={{
        backgroundColor: "#1e3a5f",
        padding: 8,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#00d9ff",
        marginBottom: 8,
      }}
    >
      <View style={styles.card}>
        <Text style={styles.name}>{item?.name}</Text>

        <Text style={styles.text}>
          Archetype: {item?.archetype} | Darkness: {item?.darkness}%
        </Text>

        <Text style={styles.text}>
          C:{item?.courage} S:{item?.skill} I:
          {item?.intelligence} Se:{item?.serenity} P:
          {item?.perception} St:{item?.strength}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /* ================= UI ================= */

  return (
    <LinearGradient colors={["#0a0e1f", "#1a2342", "#2d3561"]} style={{ flex: 1, padding: 16 }}>
      
      <View style={styles.topbar}>
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="arrow-left" size={16} color="#00d9ff" />
              </TouchableOpacity>
      
              <Text style={styles.header}>HUMAN NPCs</Text>
              <View style={{ width: 60 }} />
            </View>

      <TouchableOpacity
              onPress={() => setCreateVisible(true)}
              style={{
                backgroundColor: "#ffa500",
                padding: 10,
                borderRadius: 8,
                marginBottom: 12,
                borderWidth: 2,
                borderColor: "#cc8400",
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: "bold", color: "#1e5a8e" }}>
                CREATE NPC HUMAN
              </Text>
            </TouchableOpacity>

      {/* LOADING / CONTENT */}
      {loading ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
          Loading...
        </Text>
      ) : (
        <View style={styles.container}>
          
          {/* CAMPAIGN */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Campaign NPCs</Text>
            <FlatList
              data={npcCampaign}
              keyExtractor={(item) => "c-" + item.id}
              renderItem={({ item }) => renderNPC(item)}
            />
          </View>

          {/* TEST */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Test NPCs</Text>
            <FlatList
              data={npcTest}
              keyExtractor={(item) => "t-" + item.id}
              renderItem={({ item }) => renderNPC(item)}
            />
          </View>

        </View>
      )}

      {/* New Human Modal */}
            <Modal visible={createVisible} animationType="slide" transparent>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: 16,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#1e2a4a",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "#0ff",
                      fontWeight: "bold",
                      marginBottom: 16,
                      fontSize: 18,
                    }}
                  >
                    Add New Human
                  </Text>
      
                  {/* Nombre */}
                  <Text style={[styles.cardLabel, { marginBottom: 4 }]}>Name</Text>
                  <TextInput
                    placeholder="Name"
                    value={newHuman.name}
                    onChangeText={(t) => setNewHuman((d) => ({ ...d, name: t }))}
                    style={{
                      backgroundColor: "#fff",
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 4,
                    }}
                  />
      
                  {/* Darkness y Archetype */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flex: 1, marginLeft: 6 }}>
                      <Text style={styles.cardLabel}>Darkness (%)</Text>
                      <TextInput
                        placeholder="Darkness"
                        keyboardType="numeric"
                        value={String(newHuman.darkness)}
                        onChangeText={(t) =>
                          setNewHuman((d) => ({ ...d, darkness: Number(t) }))
                        }
                        style={{
                          backgroundColor: "#fff",
                          padding: 8,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                  </View>
      
                  {/* Stats agrupadas de 2 en 2 */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 6 }}>
                      <Text style={styles.cardLabel}>Courage</Text>
                      <TextInput
                        placeholder="Courage"
                        keyboardType="numeric"
                        value={String(newHuman.courage)}
                        onChangeText={(t) =>
                          setNewHuman((d) => ({ ...d, courage: Number(t) }))
                        }
                        style={{
                          backgroundColor: "#fff",
                          padding: 8,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 6 }}>
                      <Text style={styles.cardLabel}>Skill</Text>
                      <TextInput
                        placeholder="Skill"
                        keyboardType="numeric"
                        value={String(newHuman.skill)}
                        onChangeText={(t) =>
                          setNewHuman((d) => ({ ...d, skill: Number(t) }))
                        }
                        style={{
                          backgroundColor: "#fff",
                          padding: 8,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                  </View>
      
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 6 }}>
                      <Text style={styles.cardLabel}>Intelligence</Text>
                      <TextInput
                        placeholder="Intelligence"
                        keyboardType="numeric"
                        value={String(newHuman.intelligence)}
                        onChangeText={(t) =>
                          setNewHuman((d) => ({ ...d, intelligence: Number(t) }))
                        }
                        style={{
                          backgroundColor: "#fff",
                          padding: 8,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 6 }}>
                      <Text style={styles.cardLabel}>Serenity</Text>
                      <TextInput
                        placeholder="Serenity"
                        keyboardType="numeric"
                        value={String(newHuman.serenity)}
                        onChangeText={(t) =>
                          setNewHuman((d) => ({ ...d, serenity: Number(t) }))
                        }
                        style={{
                          backgroundColor: "#fff",
                          padding: 8,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                  </View>
      
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 6 }}>
                      <Text style={styles.cardLabel}>Perception</Text>
                      <TextInput
                        placeholder="Perception"
                        keyboardType="numeric"
                        value={String(newHuman.perception)}
                        onChangeText={(t) =>
                          setNewHuman((d) => ({ ...d, perception: Number(t) }))
                        }
                        style={{
                          backgroundColor: "#fff",
                          padding: 8,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 6 }}>
                      <Text style={styles.cardLabel}>Strength</Text>
                      <TextInput
                        placeholder="Strength"
                        keyboardType="numeric"
                        value={String(newHuman.strength)}
                        onChangeText={(t) =>
                          setNewHuman((d) => ({ ...d, strength: Number(t) }))
                        }
                        style={{
                          backgroundColor: "#fff",
                          padding: 8,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                  </View>
      
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 12,
                    }}
                  >
                    <Button title="Cancel" onPress={() => setCreateVisible(false)} />
                    <Button title="Save" onPress={createHumanNPC} />
                  </View>
                </View>
              </View>
            </Modal>

    </LinearGradient>
  );
}

/* ================= STYLES (CLON DIGIMON EXACTO) ================= */

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: "#1e3a5f",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  header: {
    color: "#00d9ff",
    fontSize: 20,
    fontWeight: "bold",
  },

  container: {
    flexDirection: "row",
    flex: 1,
    gap: 12,
  },

  column: {
    flex: 1,
    backgroundColor: "#1e3a5f",
    padding: 10,
    borderRadius: 8,
  },

  columnTitle: {
    color: "#ffa500",
    fontWeight: "bold",
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#2a4563",
    padding: 10,
    borderRadius: 6,
  },

  name: {
    color: "#ffa500",
    fontWeight: "bold",
    fontSize: 16,
  },

  text: {
    color: "#fff",
    fontSize: 12,
  },

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
    cardLabel: { color: "#0ff", fontSize: 12 },

});