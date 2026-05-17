import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getHumanArchetype } from "../src/components/human/HumanArchetypeCalc";
import api from "../src/services/api";
import { useGameData } from "../src/contexts/GameDataContext";

interface UserCampaign {
  id: number;
  id_user: number;
  id_campaign: number;
  human_sheet?: { name: string };
  partner_digimon?: { nickname: string; id_digimon?: { name: string } };
  observations?: string;
  role?: string;
  campaign?: Campaign;
  id_human?: number;
  id_partner?: number;
}

interface Campaign {
  id: number;
  next_session?: string;
  map?: string;
  observations?: string;
}

interface Digimon {
  id: number;
  name: string;
  nickname?: string;
  level: number;
  health_points: number;
  skill_points: number;
  attack: number;
  defense: number;
  speed: number;
  spirit: number;
  growth_phase: string;
  attribute: string;
  element: string;
  family_tree?: number;
  skills?: { name: string; type: "own" | "inherited"; element?: string }[];
  attack_evs?: number;
  defense_evs?: number;
  speed_evs?: number;
  spirit_evs?: number;
  friendship?: number;
}

export default function CharactersScreen() {
  const router = useRouter();
  const [userCampaigns, setUserCampaigns] = useState<UserCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [digimonVisible, setDigimonVisible] = useState(false);
  const [humanVisible, setHumanVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [speciesSearch, setSpeciesSearch] = useState("");
  const { digimon, digimonMap } = useGameData();
  const [newDigimon, setNewDigimon] = useState({
    nickname: "",
    level: 1,
    atk_ev: 0,
    def_ev: 0,
    spe_ev: 0,
    spirit_ev: 0,
    friendship: 0,
    id_digimon: 0,
    id_user: currentUserId,
  });

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
    id_user: currentUserId,
  });

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

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") window.alert(`${title}\n${message}`);
    else Alert.alert(title, message);
  };

 const fetchUserCharacters = async () => {
  try {
    setLoading(true);

    const humansRes = await api.get(`/human?id_user=${currentUserId}`);
    const humans = humansRes.datos || [];

    const digimonRes = await api.get(
      `/partner_digimon?id_user=${currentUserId}`
    );

    const digimons = digimonRes.datos || [];

    const enrichedDigimons = digimons.map((d: any) => ({
      ...d,
      species: digimonMap?.[d.id_digimon] || {
        name: "-",
        attribute: "-",
        element: "-",
        growth_phase: "-",
        health_points: 0,
        skill_points: 0,
        attack: 0,
        defense: 0,
        speed: 0,
        spirit: 0,
      },
    }));

    const formatted: UserCampaign[] = [
      ...humans.map((h: any) => ({
        id: `h-${h.id}`,
        id_user: currentUserId,
        id_campaign: 0,
        human_sheet: h,
      })),
      ...enrichedDigimons.map((d: any) => ({
        id: `d-${d.id}`,
        id_user: currentUserId,
        id_campaign: 0,
        partner_digimon: d,
      })),
    ];

    setUserCampaigns(formatted);
  } finally {
    setLoading(false);
  }
};

  const openDigimonModal = () => {
    setDigimonVisible(true);
  };

  const openHumanModal = () => {
    setHumanVisible(true);
  };

  const saveDigimon = async () => {
    newDigimon.id_user = currentUserId;
    try {
      await api.post(`/partner_digimon`, newDigimon);
      setNewDigimon((prev) => (prev ? { ...prev, ...newDigimon } : prev));
      setDigimonVisible(false);
      fetchUserCharacters();
    } catch (err) {
      console.log("Error al guardar cambios:", err);
    }
  };

  const saveHuman = async () => {
    newHuman.id_user = currentUserId;
    newHuman.archetype = getHumanArchetype({
      courage: newHuman.courage,
      skill: newHuman.skill,
      intelligence: newHuman.intelligence,
      serenity: newHuman.serenity,
      perception: newHuman.perception,
      strength: newHuman.strength,
    });
    try {
      await api.post(`/human`, newHuman);
      setNewHuman((prev) => (prev ? { ...prev, ...newHuman } : prev));
      setHumanVisible(false);
      fetchUserCharacters();
    } catch (err) {
      console.log("Error al guardar cambios:", err);
    }
  };

  useEffect(() => {
    getUserId();
    if (currentUserId !== null) {
      fetchUserCharacters();
    }
  }, [currentUserId]);

  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={{ flex: 1, padding: 16 }}
    >
      {/* Retro TopBar */}
      <View
        style={{
          backgroundColor: "#1e3a5f",
          borderWidth: 3,
          borderColor: "#2a4563",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 4,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Feather name="arrow-left" size={16} color="#00d9ff" />
            <Text style={{ color: "#00d9ff", fontSize: 18, marginLeft: 4 }}>
              BACK
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: "#00d9ff",
                fontWeight: "bold",
                fontSize: 34,
                textShadowColor: "#3f1058",
                textShadowOffset: { width: 6, height: 6 },
                textShadowRadius: 1,
                fontFamily: "../assets/fonts/PressStart2P-Regular.ttf",
              }}
            >
              DigiMastery
            </Text>
            <Text style={{ color: "#ffa500", fontSize: 20 }}>
              YOUR CHARACTERS
            </Text>
          </View>
          <View style={{ width: 60 }} />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setHumanVisible(true)}
          style={{
            flex: 1,
            backgroundColor: "#00d9ff",
            padding: 12,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: "#0099cc",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#1e5a8e",
            }}
          >
            ADD HUMAN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setDigimonVisible(true)}
          style={{
            flex: 1,
            backgroundColor: "#ffa500",
            padding: 12,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: "#cc8400",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#1e5a8e",
            }}
          >
            ADD DIGIMON
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{ flexDirection: "row", gap: 12, marginBottom: 16, flex: 1 }}
      >
        {/* HUMAN COLUMN */}
        <View style={{ flex: 1, height: "100%" }}>
          <Text
            style={{ color: "#00d9ff", fontWeight: "bold", marginBottom: 8 }}
          >
            HUMANS
          </Text>

          <FlatList
            data={userCampaigns.filter((uc) => uc.human_sheet)}
            keyExtractor={(item, index) => "h" + index}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/human",
                    params: { humanId: item.human_sheet?.id },
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
                <Text
                  style={{ color: "#ffa500", fontWeight: "bold", fontSize: 16 }}
                >
                  {item.human_sheet?.name || "-"}
                </Text>
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  Darkness: {item.human_sheet?.darkness || 0}% Archetype:{" "}
                  {item.human_sheet?.archetype || "-"} Emblem:{" "}
                  {item.human_sheet?.emblem || "-"}
                </Text>
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  Co: {item.human_sheet?.courage || 0} Sk:{" "}
                  {item.human_sheet?.skill || 0} Int:{" "}
                  {item.human_sheet?.intelligence || 0} Se:{" "}
                  {item.human_sheet?.serenity || 0} Pe:{" "}
                  {item.human_sheet?.perception || 0} St:{" "}
                  {item.human_sheet?.strength || 0}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* DIGIMON COLUMN */}
        <View style={{ flex: 1, height: "100%" }}>
          <Text
            style={{ color: "#00d9ff", fontWeight: "bold", marginBottom: 8 }}
          >
            DIGIMON
          </Text>

          <FlatList
            data={userCampaigns.filter((uc) => uc.partner_digimon)}
            keyExtractor={(item, index) => "d" + index}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/digimonSheet",
                    params: { digimonId: item.partner_digimon?.id },
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
                <Text
                  style={{ color: "#00ff88", fontWeight: "bold", fontSize: 16 }}
                >
                  {item.partner_digimon?.nickname || "-"} (
                  {item.partner_digimon?.species?.name || "-"})
                </Text>
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  Level: {item.partner_digimon?.level || 1} Attribute:{" "}
                  {item.partner_digimon?.species?.attribute || "-"} Element:{" "}
                  {item.partner_digimon?.species?.element || "-"}
                </Text>
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  HP:{" "}
                  {(item.partner_digimon?.species?.health_points || 0) +
                    2 * (item.partner_digimon?.level || 1)}
                  {"   "}SP:{" "}
                  {(item.partner_digimon?.species?.skill_points || 0) +
                    2 * (item.partner_digimon?.level || 1)}
                  {"   "}ATK:{" "}
                  {(item.partner_digimon?.species?.attack || 0) +
                    2 * (item.partner_digimon?.level || 1) +
                    (item.partner_digimon?.atk_ev || 0)}
                  {"   "}DEF:{" "}
                  {(item.partner_digimon?.species?.defense || 0) +
                    2 * (item.partner_digimon?.level || 1) +
                    (item.partner_digimon?.def_ev || 0)}
                  {"   "}SPD:{" "}
                  {(item.partner_digimon?.species?.speed || 0) +
                    2 * (item.partner_digimon?.level || 1) +
                    (item.partner_digimon?.spe_ev || 0)}
                  {"   "}SPR:{" "}
                  {(item.partner_digimon?.species?.spirit || 0) +
                    2 * (item.partner_digimon?.level || 1) +
                    (item.partner_digimon?.spirit_ev || 0)}
                </Text>
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  Growth Phase:{" "}
                  {item.partner_digimon?.species?.growth_phase || "-"}{" "}
                  Friendship: {item.partner_digimon?.friendship || 0}%
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* New Digimon Modal*/}
      <Modal visible={digimonVisible} animationType="slide" transparent>
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
                marginBottom: 12,
                fontSize: 18,
              }}
            >
              Add New Digimon
            </Text>

            {/* Nickname */}
            <Text style={[styles.cardLabel, { marginBottom: 4 }]}>
              Nickname for your Digimon
            </Text>
            <TextInput
              placeholder="Nickname"
              value={newDigimon.nickname}
              onChangeText={(t) =>
                setNewDigimon((d) => ({ ...d, nickname: t }))
              }
              style={{
                backgroundColor: "#fff",
                marginBottom: 12,
                padding: 8,
                borderRadius: 4,
              }}
            />

            {/* EVs de 2 en 2 */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.cardLabel}>
                  ATK EV (0 for newborn digimon)
                </Text>
                <TextInput
                  placeholder="ATK EV"
                  keyboardType="numeric"
                  value={String(newDigimon.atk_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, atk_ev: Number(t) }))
                  }
                  style={{
                    backgroundColor: "#fff",
                    padding: 8,
                    borderRadius: 4,
                  }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.cardLabel}>
                  DEF EV (0 for newborn Digimon)
                </Text>
                <TextInput
                  placeholder="DEF EV"
                  keyboardType="numeric"
                  value={String(newDigimon.def_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, def_ev: Number(t) }))
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
                <Text style={styles.cardLabel}>
                  SPD EV (0 for newborn Digimon)
                </Text>
                <TextInput
                  placeholder="SPD EV"
                  keyboardType="numeric"
                  value={String(newDigimon.spe_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, spe_ev: Number(t) }))
                  }
                  style={{
                    backgroundColor: "#fff",
                    padding: 8,
                    borderRadius: 4,
                  }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.cardLabel}>
                  SPIRIT EV (0 for newborn Digimon)
                </Text>
                <TextInput
                  placeholder="SPIRIT EV"
                  keyboardType="numeric"
                  value={String(newDigimon.spirit_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, spirit_ev: Number(t) }))
                  }
                  style={{
                    backgroundColor: "#fff",
                    padding: 8,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>

            {/* Friendship */}
            <Text style={[styles.cardLabel, { marginBottom: 4 }]}>
              Friendship (%) (Base friendship is 0)
            </Text>
            <TextInput
              placeholder="Friendship"
              keyboardType="numeric"
              value={String(newDigimon.friendship)}
              onChangeText={(t) =>
                setNewDigimon((d) => ({ ...d, friendship: Number(t) }))
              }
              style={{
                backgroundColor: "#fff",
                marginBottom: 12,
                padding: 8,
                borderRadius: 4,
              }}
            />

            <Text style={[styles.cardLabel, { marginBottom: 4 }]}>Species</Text>
            {/* Buscador */}
            <TextInput
              placeholder="Search species..."
              value={speciesSearch}
              onChangeText={setSpeciesSearch}
              style={{
                backgroundColor: "#fff",
                marginBottom: 8,
                padding: 8,
                borderRadius: 4,
              }}
            />

            {/* Dropdown filtrado */}
            <Picker
              selectedValue={newDigimon.id_digimon}
              onValueChange={(itemValue) =>
                setNewDigimon((d) => ({
                  ...d,
                  id_digimon: Number(itemValue),
                }))
              }
              style={{
                backgroundColor: "#fff",
                marginBottom: 12,
                borderRadius: 4,
                color: "#000",
              }}
            >
              <Picker.Item
                label="-- Select Species --"
                value={0}
                color="#000"
              />

              {digimon
                .filter((s) =>
                  s.name.toLowerCase().includes(speciesSearch.toLowerCase()),
                )
                .map((species) => (
                  <Picker.Item
                    key={species.id}
                    label={`${species.name} (#${species.id})`}
                    value={species.id}
                    color="#000"
                  />
                ))}
            </Picker>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <Button title="Cancel" onPress={() => setDigimonVisible(false)} />
              <Button title="Save" onPress={saveDigimon} />
            </View>
          </View>
        </View>
      </Modal>

      {/* New Human Modal */}
      <Modal visible={humanVisible} animationType="slide" transparent>
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
              <Button title="Cancel" onPress={() => setHumanVisible(false)} />
              <Button title="Save" onPress={saveHuman} />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cardLabel: { color: "#0ff", fontSize: 12 },
});
