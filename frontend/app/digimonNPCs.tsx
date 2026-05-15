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
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import api from "../src/services/api";

interface OtherDigimon {
  id: number;
  id_campaign: number;
  id_digimon: number;
  level?: number;
  atk_ev?: number;
  def_ev?: number;
  spirit_ev?: number;
  spe_ev?: number;
  nickname?: string;
}

interface DigimonSpecies {
  name: string;
  attribute: string;
  element: string;
  health_points: number;
  skill_points: number;
  attack: number;
  defense: number;
  speed: number;
  spirit: number;
  growth_phase: string;
}

type EnrichedNPC = OtherDigimon & {
  id_digimon: DigimonSpecies;
  stats: {
    hp: number;
    sp: number;
    atk: number;
    def: number;
    spd: number;
    spr: number;
  };
};

export default function DigimonNPCsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ campaignId?: string }>();
  const campaignId = Number(params.campaignId);

  const [npcCampaign, setNpcCampaign] = useState<EnrichedNPC[]>([]);
  const [npcTest, setNpcTest] = useState<EnrichedNPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [createVisible, setCreateVisible] = useState(false);
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const [speciesSearch, setSpeciesSearch] = useState("");
  const [newDigimon, setNewDigimon] = useState({
    level: 1,
    atk_ev: 0,
    def_ev: 0,
    speed_ev: 0,
    spirit_ev: 0,
    id_digimon: 0,
  });

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") window.alert(`${title}\n${message}`);
    else Alert.alert(title, message);
  };

  const enrichNpc = async (npc: OtherDigimon): Promise<EnrichedNPC> => {
    try {
      const otherRes = await api.get(`/other_digimon/${npc.id_digimon}`);
      const other = otherRes?.datos;

      if (!other) throw new Error("No other_digimon");

      const speciesRes = await api.get(`/digimon/${other.id_digimon}`);
      const species = speciesRes?.datos;

      if (!species) throw new Error("No species");

      const level = other.level || 1;

      const atk_ev = other.atk_ev || 0;
      const def_ev = other.def_ev || 0;
      const spe_ev = other.spe_ev || 0;
      const spirit_ev = other.spirit_ev || 0;

      return {
        ...other,
        id_digimon: species,
        stats: {
          hp: species.health_points + 2 * level,
          sp: species.skill_points + 2 * level,
          atk: species.attack + 2 * level + atk_ev,
          def: species.defense + 2 * level + def_ev,
          spd: species.speed + 2 * level + spe_ev,
          spr: species.spirit + 2 * level + spirit_ev,
        },
      };
    } catch {
      return {
        ...npc,
        id_digimon: {
          name: "-",
          attribute: "-",
          element: "-",
        },
        stats: {
          hp: 0,
          sp: 0,
          atk: 0,
          def: 0,
          spd: 0,
          spr: 0,
        },
      };
    }
  };

  const fetchSpeciesList = async () => {
    try {
      const res = await api.get("/digimon");
      setSpeciesList(res?.datos || []);
    } catch (err) {
      console.log("Error fetching species:", err);
    }
  };

  const fetchNPCs = useCallback(async () => {
    try {
      setLoading(true);

      if (!campaignId) return;

      const res1 = await api.get(`/npc/campaign/${campaignId}?type=digimon`);
      const res2 = await api.get(`/npc/campaign/1?type=digimon`);

      const listCampaign: OtherDigimon[] = Array.isArray(res1?.datos)
        ? res1.datos
        : [];

      const listTest: OtherDigimon[] = Array.isArray(res2?.datos)
        ? res2.datos
        : [];

      const enrichedCampaign = await Promise.all(
        listCampaign.map(enrichNpc),
      );

      const enrichedTest = await Promise.all(listTest.map(enrichNpc));

      setNpcCampaign(enrichedCampaign);
      setNpcTest(enrichedTest);
    } catch (err) {
      console.log(err);
      showAlert("Error", "No se pudieron cargar NPCs");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) {
      fetchNPCs();
      fetchSpeciesList();
    }
  }, [campaignId]);

  const createNPC = async () => {
    try {
      const res = await api.post("/other_digimon", newDigimon);
      const createdDigimon = res?.datos;

      if (!createdDigimon?.id) {
        throw new Error("No se creó el Digimon");
      }

      await api.post("/npc", {
        id_campaign: campaignId,
        id_digimon: createdDigimon.id,
        type: "digimon",
      });

      setCreateVisible(false);
      fetchNPCs();
    } catch (err) {
      console.log("Error creando NPC:", err);
      showAlert("Error", "No se pudo crear el NPC");
    }
  };

  const renderNPC = (item: EnrichedNPC) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/otherDigimonSheet",
          params: { digimonId: item?.id },
        })
      }
      style={{
        backgroundColor: "#1e3a5f",
        padding: 8,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#ffa500",
        marginBottom: 8,
      }}
    >
      <View style={styles.card}>
        <Text style={{ color: "#00ff88", fontWeight: "bold", fontSize: 16 }}>
          {item.id_digimon?.name || "-"}
        </Text>

        <Text style={{ color: "#fff", fontSize: 12 }}>
          Level: {item.level || 1} Attribute: {item.id_digimon?.attribute || "-"}{" "}
          Element: {item.id_digimon?.element || "-"}
        </Text>

        <Text style={{ color: "#fff", fontSize: 12 }}>
          HP: {(item.id_digimon?.health_points || 0) + 2 * (item.level || 1)}{" "}
          SP: {(item.id_digimon?.skill_points || 0) + 2 * (item.level || 1)}{" "}
          ATK: {(item.id_digimon?.attack || 0) + 2 * (item.level || 1) + (item.atk_ev || 0)}{" "}
          DEF: {(item.id_digimon?.defense || 0) + 2 * (item.level || 1) + (item.def_ev || 0)}{" "}
          SPD: {(item.id_digimon?.speed || 0) + 2 * (item.level || 1) + (item.spe_ev || 0)}{" "}
          SPR: {(item.id_digimon?.spirit || 0) + 2 * (item.level || 1) + (item.spirit_ev || 0)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={{ flex: 1, padding: 16 }}
    >
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={16} color="#00d9ff" />
        </TouchableOpacity>

        <Text style={styles.header}>DIGIMON NPCs</Text>
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
          CREATE NPC DIGIMON
        </Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
          Loading...
        </Text>
      ) : (
        <View style={styles.container}>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Campaign NPCs</Text>

            <FlatList
              data={npcCampaign}
              keyExtractor={(item) => "c-" + item.id}
              renderItem={({ item }) => renderNPC(item)}
            />
          </View>

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
            <Text style={{ color: "#0ff", fontWeight: "bold", marginBottom: 12 }}>
              Create NPC Digimon
            </Text>

            <Text style={styles.cardLabel}>Level</Text>
            <TextInput
              placeholder="Level"
              keyboardType="numeric"
              value={String(newDigimon.level)}
              onChangeText={(t) =>
                setNewDigimon((d) => ({ ...d, level: Number(t) }))
              }
              style={{ backgroundColor: "#fff", marginBottom: 8, padding: 8 }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.cardLabel}>
                  ATK EV (0 for newborn Digimon)
                </Text>
                <TextInput
                  placeholder="ATK EV"
                  keyboardType="numeric"
                  value={String(newDigimon.atk_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, atk_ev: Number(t) }))
                  }
                  style={{ backgroundColor: "#fff", marginBottom: 4, padding: 8 }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.cardLabel}>DEF EV (0 for newborn Digimon)</Text>
                <TextInput
                  placeholder="DEF EV"
                  keyboardType="numeric"
                  value={String(newDigimon.def_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, def_ev: Number(t) }))
                  }
                  style={{ backgroundColor: "#fff", marginBottom: 4, padding: 8 }}
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
                <Text style={styles.cardLabel}>SPD EV (0 for newborn Digimon)</Text>
                <TextInput
                  placeholder="SPD EV"
                  keyboardType="numeric"
                  value={String(newDigimon.speed_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, speed_ev: Number(t) }))
                  }
                  style={{ backgroundColor: "#fff", marginBottom: 4, padding: 8 }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.cardLabel}>SPIRIT EV (0 for newborn Digimon)</Text>
                <TextInput
                  placeholder="SPIRIT EV"
                  keyboardType="numeric"
                  value={String(newDigimon.spirit_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, spirit_ev: Number(t) }))
                  }
                  style={{ backgroundColor: "#fff", marginBottom: 8, padding: 8 }}
                />
              </View>
            </View>
            <Text style={styles.cardLabel}>Species</Text>
            <TextInput
              placeholder="Search species..."
              value={speciesSearch}
              onChangeText={setSpeciesSearch}
              style={{ backgroundColor: "#fff", marginBottom: 8, padding: 8 }}
            />

            <Picker
              selectedValue={newDigimon.id_digimon}
              onValueChange={(value) =>
                setNewDigimon((d) => ({ ...d, id_digimon: Number(value) }))
              }
              style={{ backgroundColor: "#fff", marginBottom: 12 }}
            >
              <Picker.Item label="-- Select Species --" value={0} />
              {speciesList
                .filter((s) =>
                  s.name.toLowerCase().includes(speciesSearch.toLowerCase())
                )
                .map((s) => (
                  <Picker.Item
                    key={s.id}
                    label={`${s.name} (#${s.id})`}
                    value={s.id}
                  />
                ))}
            </Picker>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancel" onPress={() => setCreateVisible(false)} />
              <Button title="Create" onPress={createNPC} />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

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
    marginBottom: 8,
  },
  cardLabel: { color: "#0ff", fontSize: 12 },
});