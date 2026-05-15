import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../src/services/api";

interface Campaign {
  id: number;
  name?: string;
  next_session?: string;
  map?: string;
  observations?: string;
}

interface UserCampaign {
  id_user: number;
  id_campaign: number;
  role: "DM" | "Player";
}
export default function CampaignDMPanel() {
  const params = useLocalSearchParams<{ id_campaign?: string }>();
  const campaignId = Number(params.id_campaign);
  const [editVisible, setEditVisible] = useState(false);
  const [showNPCModal, setShowNPCModal] = useState(false);
  const router = useRouter();
const [showXPModal, setShowXPModal] = useState(false);
const [showDMGModal, setShowDMGModal] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [editCampaign, setEditCampaign] = useState<Partial<Campaign>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

const [attackerStat, setAttackerStat] = useState("");
const [attackerRoll, setAttackerRoll] = useState("");
const [attackerAttr, setAttackerAttr] = useState("Vaccine");
const [attackerElem, setAttackerElem] = useState("Fire");

const [targetStat, setTargetStat] = useState("");
const [targetRoll, setTargetRoll] = useState("");
const [targetAttr, setTargetAttr] = useState("Vaccine");
const [targetElem, setTargetElem] = useState("Fire");

const ATTRIBUTES = ["Vaccine", "Virus", "Data", "Free"];

const ELEMENTS = [
  "Fire",
  "Water",
  "Nature",
  "Earth",
  "Lightning",
  "Wind",
  "Light",
  "Dark",
  "Neutral",
];

const [partnerPhase, setPartnerPhase] = useState("Rookie");
const [partnerLevel, setPartnerLevel] = useState("");

const [enemyPhase, setEnemyPhase] = useState("Rookie");
const [enemyLevel, setEnemyLevel] = useState("");

const GROWTH_PHASES = [
  "Fresh",
  "In-Training",
  "Rookie",
  "Champion",
  "Ultimate",
  "Mega",
];

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") window.alert(`${title}\n${message}`);
    else Alert.alert(title, message);
  };

  const fetchCampaign = useCallback(async () => {
    try {
      setLoading(true);

      if (!campaignId || campaignId === 0) {
        showAlert("Error", "Campaign ID inválido");
        return;
      }

      const res = await api.get(`/campaign/${campaignId}`);

      const camp = res.datos || res;

      if (!camp) {
        setCampaign(null);
        return;
      }

      setCampaign(camp);
    } catch (error: any) {
      console.log(error);
      showAlert("Error", error?.mensaje || "Error cargando campaña");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const saveCampaign = async () => {
    try {
      await api.put(`/campaign/${campaignId}`, editCampaign);

      setEditVisible(false);
      fetchCampaign();
    } catch (err) {
      console.log("Error al guardar campaña:", err);
    }
  };

   useEffect(() => {
  const checkAccess = async () => {
    try {
      let userData = null;

      if (Platform.OS === "web") {
        userData = localStorage.getItem("user");
      } else {
        userData = await SecureStore.getItemAsync("user");
      }

      if (!userData) {
        router.replace("/login");
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.id;

      if (!campaignId) {
        router.replace("/home");
        return;
      }

      const res = await api.get(
        `/user_campaign?id_user=${userId}&id_campaign=${campaignId}`
      );

      

      const relations: UserCampaign[] = res.datos;

      const relation = relations.find(
        (r) => r.id_user === userId && r.id_campaign === campaignId
      );
      if (!relation) {
        router.replace("/home");
        return;
      }

      if (relation.role !== "DM") {
        router.replace("/home");
        return;
      }

      fetchCampaign();
    } catch (err) {
      console.log("Access error:", err);
      router.replace("/home");
    }
  };

  checkAccess();
}, [campaignId]);

  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={{ flex: 1, padding: 16 }}
    >
      {/* TOPBAR */}
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
                fontSize: 28,
              }}
            >
              {campaign?.name || "CAMPAIGN"}
            </Text>
            <Text style={{ color: "#ffa500" }}>DM CONTROL PANEL</Text>
          </View>

          <View style={{ width: 60 }} />
        </View>
      </View>

      {/* CONTENIDO */}
      {loading ? (
        <Text style={{ textAlign: "center", color: "#fff", marginTop: 40 }}>
          Loading...
        </Text>
      ) : !campaign ? (
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
          {/* PANEL DM */}
          <View
            style={{
              borderWidth: 2,
              borderColor: "#ffa500",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#ffa500",
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              DUNGEON MASTER PANEL
            </Text>

            {/* FILA 1 */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/managePlayers",
                    params: { campaignId },
                  })
                }
                style={{
                  flex: 1,
                  backgroundColor: "#00d9ff",
                  padding: 10,
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
                  PLAYERS
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowNPCModal(true)}
                style={{
                  flex: 1,
                  backgroundColor: "#ffcf66",
                  padding: 10,
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
                  NPCs
                </Text>
              </TouchableOpacity>
            </View>

            {/* FILA 2 */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/generateRewards",
                    params: { campaignId },
                  })
                }
                style={{
                  flex: 1,
                  backgroundColor: "#fff200",
                  padding: 10,
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
                  REWARDS
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/sessions",
                    params: { campaignId: campaignId.toString() },
                  })
                }
                style={{
                  flex: 1,
                  backgroundColor: "#50a3e7",
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  SESSIONS
                </Text>
              </TouchableOpacity>
            </View>

            {/* FILA 3 */}
<View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
  <TouchableOpacity
    onPress={() => setShowXPModal(true)}
    style={{
      flex: 1,
      backgroundColor: "#8e44ad",
      padding: 10,
      borderRadius: 6,
    }}
  >
    <Text
      style={{
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      XP CALCULATOR
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setShowDMGModal(true)}
    style={{
      flex: 1,
      backgroundColor: "#c0392b",
      padding: 10,
      borderRadius: 6,
    }}
  >
    <Text
      style={{
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      DMG CALCULATOR
    </Text>
  </TouchableOpacity>
</View>

            {/* BOTÓN GRANDE */}
            <TouchableOpacity
              onPress={() => setEditVisible(true)}
              style={{
                backgroundColor: "#d87e0f",
                padding: 12,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                EDIT CAMPAIGN
              </Text>
            </TouchableOpacity>
          </View>

          {/* INFO EXTRA */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#00ff88",
              padding: 12,
              borderRadius: 6,
            }}
          >
            <Text
              style={{ color: "#00ff88", fontWeight: "bold", marginBottom: 6 }}
            >
              NEXT SESSION
            </Text>
            <Text style={{ color: "#fff" }}>
              {campaign.next_session || "Not scheduled"}
            </Text>

            <Text
              style={{
                color: "#ffa500",
                fontWeight: "bold",
                marginTop: 10,
                marginBottom: 4,
              }}
            >
              MAP
            </Text>
            <Text style={{ color: "#fff" }}>{campaign.map || "-"}</Text>

            <Text
              style={{
                color: "#3fc7ed",
                fontWeight: "bold",
                marginTop: 10,
                marginBottom: 4,
              }}
            >
              OBSERVATIONS
            </Text>
            <Text style={{ color: "#fff" }}>
              {campaign.observations || "-"}
            </Text>
          </View>
        </View>

        

      )}

      <Modal visible={editVisible} animationType="slide" transparent>
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
              Edit Campaign
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.cardLabel}>Campaign Name</Text>
                <TextInput
                  placeholder={campaign?.name || "Campaign Name"}
                  value={editCampaign.name}
                  onChangeText={(t) =>
                    setEditCampaign((d) => ({ ...d, name: t }))
                  }
                  style={{
                    backgroundColor: "#fff",
                    padding: 8,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={editCampaign.next_session || ""}
                onChange={(e) =>
                  setEditCampaign((d) => ({
                    ...d,
                    next_session: e.target.value,
                  }))
                }
                style={{
                  marginBottom: 12,
                  padding: 8,
                  borderRadius: 4,
                  border: "none",
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    backgroundColor: "#fff",
                    marginBottom: 12,
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  <Text>
                    {editCampaign.next_session
                      ? editCampaign.next_session
                      : "Select date"}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) {
                        setSelectedDate(date);
                        const formatted = date.toISOString().split("T")[0];
                        setEditCampaign((d) => ({
                          ...d,
                          next_session: formatted,
                        }));
                      }
                    }}
                  />
                )}
              </>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.cardLabel}>
                  Campaign Map (World description)
                </Text>
                <TextInput
                  placeholder={campaign?.map || "Map"}
                  value={editCampaign.map}
                  onChangeText={(t) =>
                    setEditCampaign((d) => ({ ...d, map: t }))
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
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.cardLabel}>Observations</Text>
                <TextInput
                  placeholder={campaign?.observations || "Observations"}
                  value={editCampaign.observations}
                  onChangeText={(t) =>
                    setEditCampaign((d) => ({ ...d, observations: t }))
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
              <Button title="Cancel" onPress={() => setEditVisible(false)} />
              <Button title="Save" onPress={saveCampaign} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showNPCModal} animationType="slide" transparent>
  <View style={styles.overlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>NPCs</Text>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/digimonNPCs",
            params: { campaignId },
          })
        }
        style={[styles.fullButton, { backgroundColor: "#50a3e7" }]}
      >
        <Text style={styles.buttonText}>DIGIMON NPCs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/humanNPCs",
            params: { campaignId },
          })
        }
        style={[styles.fullButton, { backgroundColor: "#f5801a" }]}
      >
        <Text style={styles.buttonText}>HUMAN NPCs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowNPCModal(false)}
        style={[styles.fullButton, { backgroundColor: "#999" }]}
      >
        <Text style={styles.buttonText}>CLOSE</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* XP CALCULATOR MODAL */}
<Modal visible={showXPModal} animationType="slide" transparent>
  <View style={styles.overlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>XP Calculator</Text>

      {/* ================= PARTNER ================= */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#9b59b6",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: "#d0a2ff",
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          PARTNER DIGIMON
        </Text>

        <Text style={styles.cardLabel}>Growth Phase</Text>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <Picker
            selectedValue={partnerPhase}
            onValueChange={(value) => setPartnerPhase(value)}
          >
            {GROWTH_PHASES.map((phase) => (
              <Picker.Item key={phase} label={phase} value={phase} />
            ))}
          </Picker>
        </View>

        <Text style={styles.cardLabel}>Lv.</Text>

        <TextInput
          value={partnerLevel}
          onChangeText={setPartnerLevel}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#777"
          style={styles.input}
        />
      </View>

      {/* ================= ENEMY ================= */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#e67e22",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: "#ffb366",
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          DEFEATED DIGIMON
        </Text>

        <Text style={styles.cardLabel}>Growth Phase</Text>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <Picker
            selectedValue={enemyPhase}
            onValueChange={(value) => setEnemyPhase(value)}
          >
            {GROWTH_PHASES.map((phase) => (
              <Picker.Item key={phase} label={phase} value={phase} />
            ))}
          </Picker>
        </View>

        <Text style={styles.cardLabel}>Lv.</Text>

        <TextInput
          value={enemyLevel}
          onChangeText={setEnemyLevel}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#777"
          style={styles.input}
        />
      </View>

      {/* BUTTONS */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setShowXPModal(false)}
          style={[styles.button, { backgroundColor: "#999" }]}
        >
          <Text style={styles.buttonText}>CLOSE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const xp = xpCalculator(
              partnerPhase,
              partnerLevel,
              enemyPhase,
              enemyLevel
            );

            showAlert("XP Result", `Calculated XP: ${xp}`);
          }}
          style={[styles.button, { backgroundColor: "#8e44ad" }]}
        >
          <Text style={styles.buttonText}>CALCULATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* DMG CALCULATOR MODAL */}
<Modal visible={showDMGModal} animationType="slide" transparent>
  <View style={styles.overlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>DMG Calculator</Text>

      {/* ================= ATTACKER ================= */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ff6b6b",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: "#ff6b6b",
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          ATTACKER
        </Text>

        <Text style={styles.cardLabel}>ATK / SPIRIT</Text>
        <TextInput
          value={attackerStat}
          onChangeText={setAttackerStat}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <Text style={styles.cardLabel}>DMG Roll</Text>
        <TextInput
          value={attackerRoll}
          onChangeText={setAttackerRoll}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <Text style={styles.cardLabel}>ATTR</Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <Picker
            selectedValue={attackerAttr}
            onValueChange={(value) => setAttackerAttr(value)}
          >
            {ATTRIBUTES.map((attr) => (
              <Picker.Item key={attr} label={attr} value={attr} />
            ))}
          </Picker>
        </View>

        <Text style={styles.cardLabel}>Elem</Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
          }}
        >
          <Picker
            selectedValue={attackerElem}
            onValueChange={(value) => setAttackerElem(value)}
          >
            {ELEMENTS.map((elem) => (
              <Picker.Item key={elem} label={elem} value={elem} />
            ))}
          </Picker>
        </View>
      </View>

      {/* ================= TARGET ================= */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#4dabf7",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color: "#4dabf7",
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          TARGET
        </Text>

        <Text style={styles.cardLabel}>DEF / DEF-SPIRIT</Text>
        <TextInput
          value={targetStat}
          onChangeText={setTargetStat}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <Text style={styles.cardLabel}>DEF Roll</Text>
        <TextInput
          value={targetRoll}
          onChangeText={setTargetRoll}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#777"
          style={styles.input}
        />

        <Text style={styles.cardLabel}>ATTR</Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <Picker
            selectedValue={targetAttr}
            onValueChange={(value) => setTargetAttr(value)}
          >
            {ATTRIBUTES.map((attr) => (
              <Picker.Item key={attr} label={attr} value={attr} />
            ))}
          </Picker>
        </View>

        <Text style={styles.cardLabel}>Elem</Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 6,
          }}
        >
          <Picker
            selectedValue={targetElem}
            onValueChange={(value) => setTargetElem(value)}
          >
            {ELEMENTS.map((elem) => (
              <Picker.Item key={elem} label={elem} value={elem} />
            ))}
          </Picker>
        </View>
      </View>

      {/* BUTTONS */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setShowDMGModal(false)}
          style={[styles.button, { backgroundColor: "#999" }]}
        >
          <Text style={styles.buttonText}>CLOSE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const dmg = dmgCalculator(
              attackerStat,
              targetStat,
              attackerRoll,
              targetRoll,
              attackerElem,
              targetElem,
              attackerAttr,
              targetAttr
            );

            showAlert("Damage Result", `Calculated DMG: ${dmg}`);
          }}
          style={[styles.button, { backgroundColor: "#c0392b" }]}
        >
          <Text style={styles.buttonText}>CALCULATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </LinearGradient>
  );
}

const dmgCalculator = (attackerStat, targetStat, attackerRoll, targetRoll, attackerElem, targetElem, attackerAttr, targetAttr) => {
  let dmg =
  Number(attackerStat) +
  Number(attackerRoll) -
  Number(targetStat) -
  Number(targetRoll);

  // Modificadores de atributo
  if (attackerAttr === "Vaccine" && targetAttr === "Virus") dmg *= 2;
  else if (attackerAttr === "Virus" && targetAttr === "Data") dmg *= 2;
  else if (attackerAttr === "Data" && targetAttr === "Vaccine") dmg *= 2;
 
  if (attackerElem === "Fire" && targetElem === "Nature") dmg *= 1.5;
  else if (attackerElem === "Water" && targetElem === "Fire") dmg *= 1.5;
  else if (attackerElem === "Nature" && targetElem === "Water") dmg *= 1.5;
  else if (attackerElem === "Earth" && targetElem === "Lightning") dmg *= 1.5;
  else if (attackerElem === "Lightning" && targetElem === "Wind") dmg *= 1.5;
  else if (attackerElem === "Wind" && targetElem === "Earth") dmg *= 1.5;
  else if (attackerElem === "Light" && targetElem === "Dark") dmg *= 1.5;
  else if (attackerElem === "Dark" && targetElem === "Light") dmg *= 1.25;

  if (dmg < 0) dmg = 1;
  return Math.round(dmg);
}

const xpCalculator = (
  partnerPhase,
  partnerLevel,
  enemyPhase,
  enemyLevel
) => {
  const phaseID = {
    "Fresh": 1,
    "In-Training": 2,
    "Rookie": 3,
    "Champion": 4,
    "Ultimate": 5,
    "Mega": 6,
  };

  const growthDiff =
    phaseID[enemyPhase] - phaseID[partnerPhase];

  let levelDiff = 0;
  if(enemyLevel < partnerLevel) {
    levelDiff = 5;
  } else if (enemyLevel > partnerLevel) {
    levelDiff = enemyLevel - partnerLevel;
  }

  let xp = 100; // Base XP

  if (growthDiff <= 0) {
    xp += levelDiff * 2;
  } else if (growthDiff === 1) {
    xp += levelDiff * 4;
  } else if (growthDiff === 2) {
    xp += levelDiff * 8;
  } else if (growthDiff === 3) {
    xp += levelDiff * 16;
  } else if (growthDiff === 4) {
    xp += levelDiff * 32;
  } else if (growthDiff === 5) {
    xp += levelDiff * 64;
  }

  return Math.max(1, Math.round(xp));
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 16,
  },

  modalContainer: {
    backgroundColor: "#1e2a4a",
    padding: 16,
    borderRadius: 12,
  },

  modalTitle: {
    color: "#0ff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },

  cardLabel: {
    color: "#0ff",
    fontSize: 12,
    marginBottom: 4,
    marginTop: 8,
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },

  webInput: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },

  row: {
    flexDirection: "row",
    marginTop: 12,
  },

  button: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  fullButton: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  buttonTextDark: {
    color: "#1e5a8e",
    fontWeight: "bold",
  },
});
