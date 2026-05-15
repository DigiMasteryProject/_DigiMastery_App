import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  Alert,
  Platform,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../src/services/api";

interface UserCampaign {
  id_uc: number;
  id_user: number;
  id_campaign: number;
  human_sheet?: { name: string };
  partner_digimon?: { nickname: string; id_digimon?: { name: string } };
  observations?: string;
  role?: string;
  campaign?: Campaign;
  id_human?: number;
  id_partner?: number;
  user?: { name: string };
}

interface Campaign {
  id: number;
  name?: string;
  session_count?: number;
  next_session?: string;
  map?: string;
  observations?: string;
}

export default function CampaignsScreen() {
  const router = useRouter();
  const [userCampaigns, setUserCampaigns] = useState<UserCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({});
  const [modalPlayers, setModalPlayers] = useState<UserCampaign[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allUserCampaigns, setAllUserCampaigns] = useState<UserCampaign[]>([]);
  const [campaignPlayers, setCampaignPlayers] = useState<UserCampaign[]>([]);

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

    const data = await api.get("/user_campaign");
    const allCampaigns: UserCampaign[] = data.datos || [];

    const enrichedCampaigns = await Promise.all(
      allCampaigns.map(async (uc) => {
        const newUC = { ...uc };

        // HUMAN
        if (uc.human_sheet) {
          try {
            const res = await api.get(`/human/${uc.human_sheet}`);
            newUC.human_sheet = res.datos || { name: "-" };
          } catch {
            newUC.human_sheet = { name: "-" };
          }
        }

        if (uc.partner_digimon) {
          try {
            const res = await api.get(`/partner_digimon/${uc.partner_digimon}`);
            const partner = res.datos || { nickname: "-", id_digimon: null };

            if (partner.id_digimon) {
              try {
                const digimonRes = await api.get(
                  `/digimon/${partner.id_digimon}`
                );
                partner.id_digimon = digimonRes.datos || { name: "-" };
              } catch {
                partner.id_digimon = { name: "-" };
              }
            } else {
              partner.id_digimon = { name: "-" };
            }

            newUC.partner_digimon = partner;
          } catch {
            newUC.partner_digimon = {
              nickname: "-",
              id_digimon: { name: "-" },
            };
          }
        }

        // CAMPAIGN
        if (uc.id_campaign) {
          try {
            const res = await api.get(`/campaign/${uc.id_campaign}`);
            newUC.campaign = res.datos || { id: uc.id_campaign };
          } catch {
            newUC.campaign = { id: uc.id_campaign };
          }
        }
        try {
  const userId = uc.id_user;

  const res = await api.get(`/user/${userId}`);

    newUC.user = {
      name: res.datos?.name || res.datos?.username || "-"
    };
} catch {
  newUC.user = { name: "-" };
}
        return newUC;
      })
    );

    setUserCampaigns(enrichedCampaigns);
    setAllUserCampaigns(enrichedCampaigns);

  } catch (error: any) {
    console.log(error);
    showAlert("Error", error?.mensaje || "Error cargando campañas");
  } finally {
    setLoading(false);
  }
};

const fetchCampaignPlayers = async (id_campaign: number) => {
  try {
    const res = await api.get(`/user_campaign?campaign=${id_campaign}`);
    const players = res.datos || [];

    const enriched = await Promise.all(
      players.map(async (uc: UserCampaign) => {
        const newUC = { ...uc };

        // 👤 USER
        try {
          const resUser = await api.get(`/user/${uc.id_user}`);
          newUC.user = {
            name: resUser.datos?.name || resUser.datos?.username || "-"
          };
        } catch {
          newUC.user = { name: "-" };
        }

        // 🧠 HUMAN (ESTO TE FALTABA)
        if (uc.human_sheet) {
          try {
            const resHuman = await api.get(`/human/${uc.human_sheet}`);
            newUC.human_sheet = resHuman.datos || { name: "-" };
          } catch {
            newUC.human_sheet = { name: "-" };
          }
        }

        // 🐉 PARTNER DIGIMON (también importante mantenerlo consistente)
        if (uc.partner_digimon) {
          try {
            const resPartner = await api.get(`/partner_digimon/${uc.partner_digimon}`);
            const partner = resPartner.datos || { nickname: "-", id_digimon: null };

            if (partner.id_digimon) {
              try {
                const digimonRes = await api.get(`/digimon/${partner.id_digimon}`);
                partner.id_digimon = digimonRes.datos || { name: "-" };
              } catch {
                partner.id_digimon = { name: "-" };
              }
            } else {
              partner.id_digimon = { name: "-" };
            }

            newUC.partner_digimon = partner;
          } catch {
            newUC.partner_digimon = {
              nickname: "-",
              id_digimon: { name: "-" }
            };
          }
        }

        return newUC;
      })
    );

    setCampaignPlayers(enriched);
  } catch (err) {
    console.log("Error fetching players:", err);
    setCampaignPlayers([]);
  }
};
 const openPlayersModal = async (id_campaign: number) => {
  await fetchCampaignPlayers(id_campaign);
  setModalVisible(true);
};
  const openCreateModal = () => {
    setCreateVisible(true);
  };

 const saveCampaign = async () => {
  try {
    const res = await api.post("/campaign", {
      ...newCampaign,
      id_user: currentUserId, // 🔥 CLAVE
    });

    const createdCampaign = res?.datos ?? res?.data;

    const campaignId = createdCampaign?.id;

    if (!campaignId) {
      throw new Error("No se pudo obtener el ID de la campaña");
    }

    setCreateVisible(false);
    fetchUserCampaigns();

  } catch (err) {
    console.log("Error al guardar campaña:", err);
  }
};
 useEffect(() => {
  const init = async () => {
    await getUserId();
  };
  init();
}, []);

useEffect(() => {
  if (currentUserId !== null) {
    fetchUserCampaigns();
  }
}, [currentUserId]);

  const renderCampaignCard = ({ item }: { item: UserCampaign }) => {
    const camp = item.campaign;

    const totalPlayers = allUserCampaigns.filter(
      (uc) => uc.id_campaign === item.id_campaign,
    ).length;

    return (

      <TouchableOpacity
        activeOpacity={0.8} // efecto visual al pulsar
        onPress={() => router.push(item.role === "DM" ? { pathname: `/campaignControlPanel`, params: { id_campaign: item?.id_campaign.toString() || "0" } } : { pathname: `/campaignData`, params: { uc_id: item?.id_uc?.toString() || "0" } })}
        style={{
          backgroundColor: "#1e3a5f",
          borderWidth: 2,
          borderColor: "#2a4563",
          borderRadius: 8,
          padding: 12,
          paddingTop: item.role === "DM" ? 32 : 12,
          marginBottom: 16,
          position: "relative",
        }}
      >
        {/* Icono de DM */}
        {item.role === "DM" && (
          <Image
            source={require("../assets/images/jijimon-dm.png")} // Ruta de tu imagen
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              width: 24, // ancho de la imagen
              height: 24, // alto de la imagen
              resizeMode: "contain",
            }}
          />
        )}
        <View style={{ marginBottom: 8 }}>
          <Text
            style={{
              color: "#ffa500",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {camp.name || "-"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              backgroundColor: "#7950e7",
              padding: 4,
              borderRadius: 4,
              flex: 1,
              marginRight: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
              SESSION
            </Text>
            <Text style={{ color: "#fff", fontSize: 12 }}>
              {camp?.session_count || 0}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#4140a7",
              padding: 4,
              borderRadius: 4,
              flex: 1,
              marginLeft: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
              PLAYERS
            </Text>
            <Text style={{ color: "#fff", fontSize: 12 }}>{totalPlayers}</Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#00d9ff",
            padding: 8,
            borderRadius: 4,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#ffa500", fontSize: 10, fontWeight: "bold" }}>
            TAMER
          </Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {item.human_sheet?.name || "-"}
          </Text>

          <Text
            style={{
              color: "#ff6699",
              fontSize: 10,
              fontWeight: "bold",
              marginTop: 4,
            }}
          >
            PARTNER
          </Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {item.partner_digimon?.nickname || "-"} (
            {item.partner_digimon?.id_digimon?.name || "-"})
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#ffa500",
            padding: 8,
            borderRadius: 4,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#ffa500", fontSize: 10, fontWeight: "bold" }}>
            NEXT SESSION
          </Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {camp?.next_session || "Not scheduled"}
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#00ff88",
            padding: 8,
            borderRadius: 4,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#00ff88", fontSize: 10, fontWeight: "bold" }}>
            DESCRIPTION
          </Text>
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>
            {camp?.observations || item.observations || "-"}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#00d9ff",
            padding: 8,
            borderRadius: 6,
            alignItems: "center",
          }}
          onPress={() => openPlayersModal(item.id_campaign)} // solo esto cambia
        >
          <Text style={{ color: "#1e5a8e", fontWeight: "bold", fontSize: 12 }}>
            VIEW PLAYERS
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
              SELECT CAMPAIGN
            </Text>
          </View>
          <View style={{ width: 60 }} />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
      {/* 

      JOIN CAMPAING disabled for now, future implementation: user will input a code
      provided by the DM to join an existing campaign. For now, campaigns can only be created
      and accessed by the DM, but players need to be added by the DM to join them.

        <TouchableOpacity
          onPress={() => router.push("/campaigns/join")}
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
            + JOIN CAMPAIGN
          </Text>
        </TouchableOpacity>
        */}

        <TouchableOpacity
          onPress={() => setCreateVisible(true)}
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
            + CREATE CAMPAIGN
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={{ textAlign: "center", color: "#fff", marginTop: 40 }}>
          Loading...
        </Text>
      ) : userCampaigns.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#fff", marginTop: 40 }}>
          Not participating
        </Text>
      ) : (
        <FlatList
          data={userCampaigns}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCampaignCard}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000aa",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{ backgroundColor: "#1e3a5f", borderRadius: 8, padding: 16 }}
          >
            <Text
              style={{
                color: "#00d9ff",
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              Players in Campaign
            </Text>
            <ScrollView style={{ maxHeight: 300, marginBottom: 12 }}>
              {campaignPlayers.map((p, i) => (
                <Text
                  key={i}
                  style={{ color: "#fff", fontSize: 14, marginBottom: 6 }}
                >
                  {p.user?.name || "-"} {p.human_sheet?.name || ""} ({p.role || "Player"})
                </Text>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: "#ffa500",
                padding: 8,
                borderRadius: 6,
                alignItems: "center",
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={{ color: "#1e5a8e", fontWeight: "bold", fontSize: 14 }}
              >
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
              Create Campaign
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.cardLabel}>
                  Campaign Name
                </Text>
                <TextInput
                  placeholder="Campaign Name"
                  value={newCampaign.name}
                  onChangeText={(t) =>
                    setNewCampaign((d) => ({ ...d, name: t }))
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
    value={newCampaign.next_session || ""}
    onChange={(e) =>
      setNewCampaign((d) => ({
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
        {newCampaign.next_session
          ? newCampaign.next_session
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
            setNewCampaign((d) => ({
              ...d,
              next_session: formatted,
            }));
          }
        }}
      />
    )}
  </>
)}

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
                    setNewCampaign((d) => ({ ...d, next_session: formatted }));
                  }
                }}
              />
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
                  placeholder="Map"
                  value={newCampaign.map}
                  onChangeText={(t) =>
                    setNewCampaign((d) => ({ ...d, map: t }))
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
                  placeholder="Observations"
                  value={newCampaign.observations}
                  onChangeText={(t) =>
                    setNewCampaign((d) => ({ ...d, observations: t }))
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
              <Button title="Save" onPress={saveCampaign} />
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
