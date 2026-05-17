import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useGameData } from "../src/contexts/GameDataContext";
import api from "../src/services/api";

interface UserCampaign {
  id: number;
  id_user: number;
  id_campaign: number;
  human_sheet?: { name: string };
  partner_digimon?: { nickname: string; species: Digimon | null };
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

export default function CampaignsScreen() {
  const params = useLocalSearchParams<{ uc_id?: string }>();
  const ucId = Number(params.uc_id);
  const router = useRouter();
  const [userCampaign, setUserCampaigns] = useState<UserCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [editingObs, setEditingObs] = useState(false);
  const [obsText, setObsText] = useState("");
  const [humanModalVisible, setHumanModalVisible] = useState(false);
  const [digimonModalVisible, setDigimonModalVisible] = useState(false);
  const [digimonVisible, setDigimonVisible] = useState(false);
  const [humans, setHumans] = useState<any[]>([]);
  const [digimons, setDigimons] = useState<any[]>([]);
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

  const fetchUserCampaigns = async () => {
    try {
      setLoading(true);

      const data = await api.get(`/user_campaign/${ucId}`);

      let uc: UserCampaign | null = null;

      if (Array.isArray(data.datos) && data.datos.length > 0) {
        uc = data.datos[0];
      } else if (data.datos) {
        uc = data.datos;
      }

      if (!uc) {
        setUserCampaigns(null);
        setObsText("");
        return;
      }

      // normalize ids
      if (uc.human_sheet && typeof uc.human_sheet !== "object") {
        uc.id_human = uc.human_sheet as number;
      }

      if (uc.partner_digimon && typeof uc.partner_digimon !== "object") {
        uc.id_partner = uc.partner_digimon as number;
      }

      // =========================
      // HUMAN (solo 1 fetch necesario)
      // =========================
      if (uc.id_human) {
        try {
          const res = await api.get(`/human/${uc.id_human}`);
          uc.human_sheet = res.datos || { name: "-" };
        } catch {
          uc.human_sheet = { name: "-" };
        }
      }

      // =========================
      // PARTNER DIGIMON (sin species fetch)
      // =========================
      if (uc.id_partner) {
        try {
          const res = await api.get(`/partner_digimon/${uc.id_partner}`);
          const partner = res.datos || {
            nickname: "-",
            id_digimon: null,
          };

          if (partner.id_digimon) {
            partner.species = digimonMap[partner.id_digimon] ?? null;
          } else {
            partner.species = null;
          }

          uc.partner_digimon = partner;
        } catch {
          uc.partner_digimon = {
            nickname: "-",
            species: null,
          };
        }
      }

      // =========================
      // CAMPAIGN
      // =========================
      if (uc.id_campaign) {
        try {
          const res = await api.get(`/campaign/${uc.id_campaign}`);
          uc.campaign = res.datos || { id: uc.id_campaign };
        } catch {
          uc.campaign = { id: uc.id_campaign };
        }
      }

      setUserCampaigns(uc);

      fetchAvailableSheets(uc.id_user);

      setObsText(uc.observations || "");
    } catch (error: any) {
      console.log(error);
      showAlert("Error", error?.mensaje || "Error cargando campaña");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSheets = async (userId: number) => {
    try {
      const humanRes = await api.get(`/human?id_user=${userId}`);
      setHumans(humanRes.datos || []);

      const digimonRes = await api.get(`/partner_digimon?id_user=${userId}`);
      setDigimons(digimonRes.datos || []);
    } catch (err) {
      console.log("Error fetching sheets:", err);
    }
  };

  useEffect(() => {
    getUserId();
    if (currentUserId !== null) {
      fetchUserCampaigns();
    }
  }, [currentUserId]);

  const saveObservations = async () => {
    if (!ucId) {
      showAlert("Error", "ID no válido");
      return;
    }

    try {
      await api.put(`/user_campaign/${ucId}`, {
        observations: obsText,
      });

      setUserCampaigns((prev) =>
        prev ? { ...prev, observations: obsText } : prev,
      );

      setEditingObs(false);
      showAlert("OK", "Observaciones guardadas");
    } catch (err) {
      console.log(err);
      showAlert("Error", "No se pudieron guardar");
    }
  };

  const assignHuman = async (humanId: number) => {
    try {
      await api.put(`/user_campaign/${ucId}`, {
        human_sheet: humanId,
      });

      setHumanModalVisible(false);
      fetchUserCampaigns();
    } catch (err) {
      console.log(err);
    }
  };

  const createHuman = async () => {
    try {
      const res = await api.post(`/human`, {
        id_user: userCampaign?.id_user,
        name: "New Human",
        archetype: "-",
        courage: 1,
        skill: 1,
        intelligence: 1,
        serenity: 1,
        strength: 1,
        perception: 1,
        darkness: 0,
      });

      await api.put(`/user_campaign/${ucId}`, {
        human_sheet: res.datos.id,
      });

      setHumanModalVisible(false);
      fetchUserCampaigns();
      router.push({
        pathname: "/human",
        params: { humanId: res.datos.id.toString() },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const assignDigimon = async (digimonId: number) => {
    try {
      await api.put(`/user_campaign/${ucId}`, {
        partner_digimon: digimonId,
      });

      setDigimonModalVisible(false);
      fetchUserCampaigns();
    } catch (err) {
      console.log(err);
    }
  };

  const saveDigimon = async () => {
    newDigimon.id_user = currentUserId;
    try {
      const res = await api.post(`/partner_digimon`, newDigimon);
      setNewDigimon((prev) => (prev ? { ...prev, ...newDigimon } : prev));
      await api.put(`/user_campaign/${ucId}`, {
        partner_digimon: res.datos.id,
      });
      setDigimonVisible(false);
      showAlert("OK", "Digimon creado y asignado");
      fetchUserCampaigns();
      router.push({
        pathname: "/digimonSheet",
        params: { digimonId: res.datos.id.toString() },
      });
    } catch (err) {
      console.log("Error al guardar cambios:", err);
    }
  };

  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={{ flex: 1, padding: 16 }}
    >
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
              }}
            >
              {userCampaign?.human_sheet?.name || "PLAYER"}'s DATA
            </Text>
          </View>

          <View style={{ width: 60 }} />
        </View>
      </View>

      {loading ? (
        <Text style={{ textAlign: "center", color: "#fff", marginTop: 40 }}>
          Loading...
        </Text>
      ) : !userCampaign ? (
        <Text style={{ textAlign: "center", color: "#fff", marginTop: 40 }}>
          No data
        </Text>
      ) : (
        <View
          style={{
            backgroundColor: "#1e3a5f",
            borderWidth: 2,
            borderColor: "#2a4563",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (!userCampaign.human_sheet) {
                setHumanModalVisible(true);
              } else {
                router.push({
                  pathname: "/human",
                  params: {
                    humanId: userCampaign.human_sheet.id.toString(),
                  },
                });
              }
            }}
            style={{
              backgroundColor: "#00d9ff",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#1e5a8e",
              }}
            >
              {userCampaign.human_sheet?.name?.toUpperCase() || "CREATE HUMAN"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!userCampaign.partner_digimon) {
                setDigimonModalVisible(true);
              } else {
                router.push({
                  pathname: "/digimonSheet",
                  params: {
                    digimonId: userCampaign.partner_digimon.id.toString(),
                  },
                });
              }
            }}
            style={{
              backgroundColor: "#ff6699",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Text
              style={{ textAlign: "center", fontWeight: "bold", color: "#fff" }}
            >
              {userCampaign.partner_digimon?.nickname?.toUpperCase() ||
                "CREATE DIGIMON"}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#00ff88",
              padding: 12,
              borderRadius: 6,
              marginBottom: 12,
            }}
          >
            <Text
              style={{ color: "#00ff88", fontWeight: "bold", marginBottom: 6 }}
            >
              OBSERVATIONS
            </Text>

            {editingObs ? (
              <>
                <TextInput
                  value={obsText}
                  onChangeText={setObsText}
                  multiline
                  style={{
                    backgroundColor: "#2a4563",
                    color: "#fff",
                    padding: 8,
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />

                <TouchableOpacity
                  onPress={saveObservations}
                  style={{
                    backgroundColor: "#00ff88",
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#1e5a8e",
                    }}
                  >
                    SAVE
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{ color: "#fff", marginBottom: 8 }}>
                  {userCampaign.observations || "No observations"}
                </Text>

                <TouchableOpacity
                  onPress={() => setEditingObs(true)}
                  style={{
                    backgroundColor: "#00ff88",
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#1e5a8e",
                    }}
                  >
                    EDIT
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/codeRedeem",
                params: { userId: userCampaign?.id_uc.toString() || "" },
              })
            }
            style={{ backgroundColor: "#ffa500", padding: 12, borderRadius: 8 }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#1e5a8e",
              }}
            >
              REDEEM REWARDS
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={humanModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Human Sheet</Text>

            <TouchableOpacity onPress={createHuman}>
              <Text style={{ color: "#00ff88", marginBottom: 12 }}>
                ➕ Create new human
              </Text>
            </TouchableOpacity>

            <Text style={{ color: "#fff", marginBottom: 8 }}>
              Or select existing:
            </Text>

            {humans.map((h) => (
              <TouchableOpacity key={h.id} onPress={() => assignHuman(h.id)}>
                <Text style={{ color: "#00d9ff", padding: 6 }}>{h.name}</Text>
              </TouchableOpacity>
            ))}

            <Button title="Close" onPress={() => setHumanModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={digimonModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Partner Digimon</Text>
            <TouchableOpacity onPress={() => setDigimonVisible(true)}>
              <Text style={{ color: "#00ff88", marginBottom: 12 }}>
                ➕ Create new digimon
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "#fff", marginBottom: 8 }}>
              Select existing:
            </Text>

            {digimons.map((d) => (
              <TouchableOpacity key={d.id} onPress={() => assignDigimon(d.id)}>
                <Text style={{ color: "#ff6699", padding: 6 }}>
                  {d.nickname}
                </Text>
              </TouchableOpacity>
            ))}

            <Button
              title="Close"
              onPress={() => setDigimonModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

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
            <TextInput
              placeholder="Search species..."
              value={speciesSearch}
              onChangeText={setSpeciesSearch}
              style={{
                backgroundColor: "#fff",
                marginBottom: 8,
                padding: 8,
                borderRadius: 4,
                color: "#000",
              }}
            />

            <Picker
              selectedValue={newDigimon.id_digimon}
              onValueChange={(itemValue) =>
                setNewDigimon((d) => ({ ...d, id_digimon: Number(itemValue) }))
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
  cardLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
