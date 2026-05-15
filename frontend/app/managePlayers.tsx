import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import api from "../src/services/api";

interface Campaign {
  id: number;
  name: string;
}

interface Player {
  id_uc: number;
  id_user: number;
  role: string;
  human_sheet?: any;
  partner_digimon?: any;
  user?: {
    username: string;
  };
}

export default function CharactersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ campaignId?: string }>();
  const campaignId = Number(params.campaignId) || null;

  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Player | null>(null);
  const [searching, setSearching] = useState(false);
  const [emblemModalVisible, setEmblemModalVisible] = useState(false);
const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
const [selectedEmblem, setSelectedEmblem] = useState("Courage");

const EMBLEMS = [
  "Courage",
  "Friendship",
  "Sincerity",
  "Love",
  "Knowledge",
  "Purity",
  "Hope",
  "Light",
  "Kindness",
  "Miracles",
  "Destiny",
];

  const enrichPlayer = async (p: Player) => {
    try {
      const userRes = await api.get(`/user/${p.id_user}`);
      const user = userRes?.datos;

      let human = null;
      let digimon = null;

      if (p.human_sheet) {
        const res = await api.get(`/human/${p.human_sheet}`);
        human = res?.datos;
      }

     if (p.partner_digimon) {
  const otherRes = await api.get(`/partner_digimon/${p.partner_digimon}`);
  const other = otherRes?.datos;

  if (other) {
    let species = null;

    if (other.id_digimon) {
      try {
        const speciesRes = await api.get(`/digimon/${other.id_digimon}`);
        species = speciesRes?.datos || null;
      } catch (err) {
        console.log("Error loading species:", err);
      }
    }

    const level = other.level || 1;
    const atk_ev = other.atk_ev || 0;
    const def_ev = other.def_ev || 0;
    const spe_ev = other.spe_ev || 0;
    const spirit_ev = other.spirit_ev || 0;

    digimon = {
      ...other,
      species: species || {
        name: "Unknown",
        health_points: 0,
        skill_points: 0,
        attack: 0,
        defense: 0,
        speed: 0,
        spirit: 0,
        growth_phase: "-",
        element: "-",
        attribute: "-",
      },
      stats: {
        hp: (species?.health_points || 0) + 2 * level,
        sp: (species?.skill_points || 0) + 2 * level,
        atk: (species?.attack || 0) + 2 * level + atk_ev,
        def: (species?.defense || 0) + 2 * level + def_ev,
        spd: (species?.speed || 0) + 2 * level + spe_ev,
        spr: (species?.spirit || 0) + 2 * level + spirit_ev,
      },
    };
  }
}

      return {
        ...p,
        user,
        human_sheet: human,
        partner_digimon: digimon,
      };
    } catch (err) {
      console.log("Error enriching player:", err);
      return p;
    }
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);

      const campaign = await api.get(`/campaign/${campaignId}`);
      setCurrentCampaign(campaign.datos);

      const res = await api.get(`/user_campaign?campaign=${campaignId}`);
      const list = res?.datos || [];

      const enriched = await Promise.all(list.map(enrichPlayer));

      setPlayers(enriched);
    } catch (err) {
      console.log("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

const searchUsers = async (text: string) => {
  setSearch(text);

  if (!text || text.length < 2) {
    setResults([]);
    return;
  }

  try {
    setSearching(true);

    const res = await api.get(`/user/username?username=${text}`);

    // 🔥 convertir siempre a array
    const users = res?.datos
      ? Array.isArray(res.datos)
        ? res.datos
        : [res.datos]
      : [];

    setResults(users);

  } catch (err) {
    console.log("Error searching users:", err);
    setResults([]);
  } finally {
    setSearching(false);
  }
};

  const addUserToCampaign = async (userId: number) => {
    try {
      await api.post(`/user_campaign`, {
        id_campaign: campaignId,
        id_user: userId,
        role: "Player",
        human_sheet: null,
        partner_digimon: null,
      });

      setModalVisible(false);
      setSearch("");
      setResults([]);
      fetchPlayers();
    } catch (err) {
      console.log("Error adding user to campaign:", err);
    }
  };
  const removePlayer = async (userCampaignId: number) => {
    console.log("Attempting to remove player with userCampaignId:", userCampaignId);
  try {
    await api.delete(`/user_campaign/${userCampaignId}`);
    fetchPlayers();
  } catch (err) {
    console.log("Error removing player:", err);
  }
};
const confirmRemovePlayer = async (id_uc: number) => {
  setUserToDelete(players.find(p => p.id_uc === id_uc) || null);
  setDeleteModalVisible(true);
};

const deleteUser = async () => {
  if (!userToDelete) return;
  try {    await api.delete(`/user_campaign/${userToDelete.id_uc}`);
    fetchPlayers();
  } catch (err) {
    console.log("Error deleting user from campaign:", err);
  }
};

const unlockEmblem = async () => {
  if (!selectedPlayer?.human_sheet?.id) return;
  try {
    await api.put(
      `/human/${selectedPlayer.human_sheet.id}`,
      {
        emblem: selectedEmblem,
      }
    );

    setEmblemModalVisible(false);
    setSelectedPlayer(null);

    fetchPlayers();

  } catch (err) {
    console.log("Error unlocking emblem:", err);
  }
};
  useEffect(() => {
    if (campaignId !== null) fetchPlayers();
  }, [campaignId]);

  const renderPlayer = (item: Player) => (
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
      <Text style={{ color: "#ffa500", fontWeight: "bold", fontSize: 14 }}>
        {item.user?.username || "Unknown"}
      </Text>

      <Text style={{ color: "#00d9ff", fontSize: 12, marginBottom: 6 }}>
        {item.role || "-"}
      </Text>

      {item.human_sheet && (
        <>
          <Text style={{ color: "#ffa500", fontSize: 12 }}>HUMAN</Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {item.human_sheet.name} | Archetype: {item.human_sheet.archetype} | Darkness: {item.human_sheet.darkness}%
          </Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            [ Courage: {item.human_sheet.courage} Skill: {item.human_sheet.skill} Intelligence: {item.human_sheet.intelligence} Serenity: {item.human_sheet.serenity} Strength: {item.human_sheet.strength} Perception: {item.human_sheet.perception} ]
          </Text>
        </>
      )}

      {item.partner_digimon && (
  <>
    <Text style={{ color: "#ffa500", fontSize: 12, marginTop: 6 }}>
      DIGIMON
    </Text>

    <Text style={{ color: "#fff", fontSize: 12 }}>
      {item.partner_digimon.nickname} | LV: {item.partner_digimon.level || 1} | ({item.partner_digimon.species?.name || "Unknown"})
    </Text>

    <Text style={{ color: "#fff", fontSize: 12 }}>
      [ HP: {statCalculator(item.partner_digimon.species?.health_points || 0, item.partner_digimon.level)} |
      SP: {statCalculator(item.partner_digimon.species?.skill_points || 0, item.partner_digimon.level)} |
      ATK: {statCalculatorEV(item.partner_digimon.species?.attack || 0, item.partner_digimon.level, item.partner_digimon.atk_ev)} |
      DEF: {statCalculatorEV(item.partner_digimon.species?.defense || 0, item.partner_digimon.level, item.partner_digimon.def_ev)} |
      SPD: {statCalculatorEV(item.partner_digimon.species?.speed || 0, item.partner_digimon.level, item.partner_digimon.spe_ev)} |
      SPR: {statCalculatorEV(item.partner_digimon.species?.spirit || 0, item.partner_digimon.level, item.partner_digimon.spirit_ev)} ]
    </Text>

    <Text style={{ color: "#fff", fontSize: 12 }}>
      Growth: {item.partner_digimon.species?.growth_phase || "-"} |
      Element: {item.partner_digimon.species?.element || "-"} |
      Attribute: {item.partner_digimon.species?.attribute || "-"}
    </Text>
  </>
)}
      <TouchableOpacity
  onPress={() => confirmRemovePlayer(item.id_uc)}
  style={{
    position: "absolute",
    top: 8,
    right: 8,
  }}
>
  <Feather name="trash-2" size={16} color="#ff4d4d" />
</TouchableOpacity>

<TouchableOpacity
  onPress={() => {
    if (item.human_sheet?.emblem) return;
    setSelectedPlayer(item);
    setSelectedEmblem("Courage");
    setEmblemModalVisible(true);
  }}
  style={{
    marginTop: 10,
    backgroundColor: "#ffd166",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  }}
>
  <Text
  style={{
    color: item.human_sheet?.emblem ? "#264a56" : "#1e2a4a",
    fontWeight: "bold",
    fontSize: 12,
  }}
>
  {item.human_sheet?.emblem
    ? `EMBLEM: ${item.human_sheet.emblem}`
    : "UNLOCK EMBLEM"}
</Text>
</TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#0a0e1f", "#1a2342", "#2d3561"]} style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          backgroundColor: "#1e3a5f",
          borderWidth: 3,
          borderColor: "#2a4563",
          padding: 8,
          borderRadius: 4,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color="#00d9ff" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: "#00d9ff", fontSize: 28, fontWeight: "bold" }}>
              {currentCampaign?.name || "DigiMastery"}
            </Text>
            <Text style={{ color: "#ffa500" }}>PLAYERS</Text>
          </View>

          <View style={{ width: 20 }} />
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: "#d87e0f",
            padding: 12,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold", color: "#ffffff" }}>
            ADD PLAYER
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
          Loading...
        </Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => renderPlayer(item)}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Player</Text>

            <TextInput
              placeholder="Search username..."
              value={search}
              onChangeText={searchUsers}
              style={{
                backgroundColor: "#fff",
                padding: 8,
                borderRadius: 6,
                marginBottom: 12,
              }}
            />

            <FlatList
              data={results}
              keyExtractor={(item) => String(item.id)}
              style={{ maxHeight: 200 }}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 8,
                    backgroundColor: "#2a4563",
                    marginBottom: 6,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: "#fff" }}>{item.username}</Text>

                  <TouchableOpacity onPress={() => addUserToCampaign(item.id)}>
                    <Text style={{ color: "#00d9ff", fontWeight: "bold" }}>ADD</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <View style={{ marginTop: 12 }}>
              <Button
                title="Close"
                onPress={() => {
                  setModalVisible(false);
                  setSearch("");
                  setResults([]);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteModalVisible} transparent animationType="fade">
              <View style={styles.modalBg}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>Confirm delete user</Text>
                  <Text style={{ color: "#fff", marginBottom: 12 }}>
                    Are you sure you want to delete{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {userToDelete?.username}
                    </Text>
                    ?
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setDeleteModalVisible(false);
                        setUserToDelete(null);
                      }}
                      style={[styles.saveBtn, { backgroundColor: "#555" }]}
                    >
                      <Text style={styles.saveText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        if (!userToDelete) return;
                        deleteUser(userToDelete);
                        setDeleteModalVisible(false);
                        setUserToDelete(null);
                      }}
                      style={[styles.saveBtn, { backgroundColor: "#ff4d4d" }]}
                    >
                      <Text style={styles.saveText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal visible={emblemModalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Unlock Emblem</Text>

      <Text
        style={{
          color: "#fff",
          marginBottom: 10,
        }}
      >
        Select an emblem for{" "}
        <Text style={{ fontWeight: "bold" }}>
          {selectedPlayer?.human_sheet?.name || "Player"}
        </Text>
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 6,
          marginBottom: 16,
        }}
      >
        <Picker
          selectedValue={selectedEmblem}
          onValueChange={(value) => setSelectedEmblem(value)}
        >
          {EMBLEMS.map((emblem) => (
            <Picker.Item
              key={emblem}
              label={emblem}
              value={emblem}
            />
          ))}
        </Picker>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setEmblemModalVisible(false);
            setSelectedPlayer(null);
          }}
          style={[styles.saveBtn, { backgroundColor: "#555" }]}
        >
          <Text style={styles.saveText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={unlockEmblem}
          style={[styles.saveBtn, { backgroundColor: "#ffd166" }]}
        >
          <Text
            style={{
              color: "#1e2a4a",
              fontWeight: "bold",
            }}
          >
            Unlock
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </LinearGradient>
  );
}

const statCalculator = (base: number, level: number) => {
  return base + level * 2;
};

const statCalculatorEV = (base: number, level: number, ev: number) => {
  return base + level * 2 + ev;
};

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
  saveBtn: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 16,
  },
    modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 16,
  },
});