import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import {
  Platform,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import api from "../src/services/api";
import useAdminGuard from "../src/hooks/useAdminGuard";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";

interface User {
  id: number;
  username: string;
  email: string;
  banned?: boolean;
  last_login?: string;
}

export default function AdminScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [showNpcModal, setShowNpcModal] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [npcSearch, setNpcSearch] = useState("");
  const [npcs, setNpcs] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [createHumanVisible, setCreateHumanVisible] = useState(false);
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
  });
  const router = useRouter();

   const loading = useAdminGuard();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user?role=user");
      setUsers(res.datos || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSpeciesList = async () => {
    try {
      const res = await api.get("/digimon");
      setSpeciesList(res.datos || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNpcs = async () => {
    try {
      const res = await api.get("/npc/campaign/1");
      const npcList = res.datos || [];
      const enrichedNpcs = await Promise.all(
        npcList.map(async (npc: any) => {
          let human = null;
          let partner = null;
          if (npc.id_human) {
            try {
              const humanRes = await api.get(`/human/${npc.id_human}`);
              human = humanRes.datos;
            } catch {}
          }
          if (npc.id_digimon) {
            try {
              const digiRes = await api.get(`/other_digimon/${npc.id_digimon}`);
              partner = digiRes.datos;
              if (partner?.id_digimon) {
                const speciesRes = await api.get(`/digimon/${partner.id_digimon}`);
                partner.id_digimon = speciesRes.datos;
              }
            } catch {}
          }
          return {
            ...npc,
            id_human: human,
            id_digimon: partner,
          };
        })
      );
      setNpcs(enrichedNpcs);
    } catch (err) {
      console.log(err);
    }
  };

 
  useEffect(() => {
    fetchUsers();
    fetchNpcs();
    fetchSpeciesList();
  }, []);

  const toggleBan = async (user: User) => {
    try {
      await api.put(`/user/${user.id}`, { banned: !user.banned });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, banned: !u.banned } : u
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } else {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");
    }
    router.replace("/login");
  };

  const openDigimonModal = () => {
    setShowNpcModal(false);
    setNewDigimon({
      level: 1,
      atk_ev: 0,
      def_ev: 0,
      speed_ev: 0,
      spirit_ev: 0,
      id_digimon: 1,
    });
    setCreateVisible(true);
  };

  const openHumanModal = () => {
    setShowNpcModal(false);
    setNewHuman({
      name: "",
      archetype: "",
      darkness: 0,
      courage: 0,
      skill: 0,
      intelligence: 0,
      serenity: 0,
      perception: 0,
      strength: 0,
    });
    setCreateHumanVisible(true);
  };

  const createDigimonNPC = async () => {
    try {
      const res = await api.post("/other_digimon", newDigimon);
      const created = res?.datos;
      await api.post("/npc", {
        id_campaign: 1,
        id_digimon: created.id,
        type: "digimon",
      });
      setCreateVisible(false);
      fetchNpcs();
      Alert.alert("OK", "Digimon NPC created");
    } catch (err) {
      console.log(err);
    }
  };

  const createHumanNPC = async () => {
    try {
      const humanRes = await api.post("/human", newHuman);
      const createdHuman = humanRes?.datos;
      await api.post("/npc", {
        id_campaign: 1,
        id_human: createdHuman.id,
        type: "human",
      });
      setCreateHumanVisible(false);
      fetchNpcs();
      Alert.alert("OK", "Human NPC created");
    } catch (err) {
      console.log(err);
    }
  };

  const filteredNpcs = npcs.filter((n) => {
    const s = npcSearch.toLowerCase();
    const human = n.id_human?.name?.toLowerCase() || "";
    const digimon = n.id_digimon?.nickname?.toLowerCase() || "";
    const species = n.id_digimon?.id_digimon?.name?.toLowerCase() || "";
    return human.includes(s) || digimon.includes(s) || species.includes(s);
  });

  const filteredSpecies = speciesList.filter((s) =>
    s.name.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const activeUsers = users.filter((u) => {
    if (!u.last_login) return false;
    const last = new Date(u.last_login);
    const now = new Date();
    return (now.getTime() - last.getTime()) / 60000 <= 10;
  });

   if (loading) {
    return null;
  }


  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>ADMIN PANEL</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Active users recently</Text>
        <Text style={styles.value}>{activeUsers.length}</Text>
      </View>

      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>USERS</Text>
          <TextInput
            placeholder="Search user..."
            value={userSearch}
            onChangeText={setUserSearch}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredUsers}
            keyExtractor={(i) => String(i.id)}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text style={styles.username}>
                  {item.username} {item.banned ? "🚫" : "🟢"}
                </Text>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => toggleBan(item)}>
                    <Text style={styles.actionBtn}>
                      {item.banned ? "UNBAN" : "BAN"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setUserToDelete(item);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <Text style={[styles.actionBtn, { color: "#ff4d4d" }]}>
                      DELETE
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.column}>
          <Text style={styles.sectionTitle}>NPCS</Text>
          <TextInput
            placeholder="Search npc..."
            value={npcSearch}
            onChangeText={setNpcSearch}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredNpcs}
            keyExtractor={(i, idx) => String(i.id ?? idx)}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <TouchableOpacity
                  onPress={() => {
                    if (item.id_human) {
                      router.push({
                        pathname: "/human",
                        params: { humanId: item.id_human.id },
                      });
                    }
                    if (item.id_digimon) {
                      router.push({
                        pathname: "/otherDigimonSheet",
                        params: { digimonId: item.id_digimon.id },
                      });
                    }
                  }}
                  style={styles.userCard}
                >
                  {item.id_human && (
                    <>
                      <Text style={styles.username}>
                        👤 {item.id_human.name}
                      </Text>
                      <Text style={styles.email}>
                        Archetype: {item.id_human.archetype || "-"}
                      </Text>
                    </>
                  )}
                  {item.id_digimon && (
                    <>
                      <Text style={styles.username}>
                        🟢 {item.id_digimon.id_digimon?.name || "-"}
                      </Text>
                      <Text style={styles.email}>
                        Growth Phase: {item.id_digimon.id_digimon?.growth_phase || "-"}
                      </Text>
                      <Text style={styles.email}>
                        Attribute: {item.id_digimon.id_digimon?.attribute || "-"}{" "}
                        Element: {item.id_digimon.id_digimon?.element || "-"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowNpcModal(true)}
      >
        <Text style={styles.fabText}>+ NPC</Text>
      </TouchableOpacity>

      <Modal visible={showNpcModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>NPCs</Text>
            <TouchableOpacity
              onPress={openDigimonModal}
              style={[styles.fullButton, { backgroundColor: "#50a3e7" }]}
            >
              <Text style={styles.buttonText}>DIGIMON NPCs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openHumanModal()}
              style={[styles.fullButton, { backgroundColor: "#f5801a" }]}
            >
              <Text style={styles.buttonText}>HUMAN NPCs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowNpcModal(false)}
              style={[styles.fullButton, { backgroundColor: "#999" }]}
            >
              <Text style={styles.buttonText}>CLOSE</Text>
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
                marginBottom: 12,
              }}
            >
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
              style={{
                backgroundColor: "#fff",
                marginBottom: 8,
                padding: 8,
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
                  ATK EV (0 for newborn Digimon)
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
                    marginBottom: 4,
                    padding: 8,
                  }}
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
                  style={{
                    backgroundColor: "#fff",
                    marginBottom: 4,
                    padding: 8,
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
                <Text style={styles.cardLabel}>SPD EV (0 for newborn Digimon)</Text>
                <TextInput
                  placeholder="SPD EV"
                  keyboardType="numeric"
                  value={String(newDigimon.speed_ev)}
                  onChangeText={(t) =>
                    setNewDigimon((d) => ({ ...d, speed_ev: Number(t) }))
                  }
                  style={{
                    backgroundColor: "#fff",
                    marginBottom: 4,
                    padding: 8,
                  }}
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
                  style={{
                    backgroundColor: "#fff",
                    marginBottom: 8,
                    padding: 8,
                  }}
                />
              </View>
            </View>
            <Text style={styles.cardLabel}>Species</Text>
            <TextInput
              placeholder="Search species..."
              value={speciesSearch}
              onChangeText={setSpeciesSearch}
              style={{
                backgroundColor: "#fff",
                marginBottom: 8,
                padding: 8,
              }}
            />
            <Picker
              selectedValue={newDigimon.id_digimon}
              onValueChange={(value) =>
                setNewDigimon((d) => ({ ...d, id_digimon: Number(value) }))
              }
              style={{
                backgroundColor: "#fff",
                marginBottom: 12,
              }}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button title="Cancel" onPress={() => setCreateVisible(false)} />
              <Button title="Create" onPress={createDigimonNPC} />
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
                  await deleteUser(userToDelete.id);
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

      <Modal visible={createHumanVisible} animationType="slide" transparent>
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.cardLabel}>Archetype</Text>
                <TextInput
                  placeholder="Archetype"
                  value={newHuman.archetype}
                  onChangeText={(t) =>
                    setNewHuman((d) => ({ ...d, archetype: t }))
                  }
                  style={{
                    backgroundColor: "#fff",
                    padding: 8,
                    borderRadius: 4,
                  }}
                />
              </View>
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
              <Button title="Cancel" onPress={() => setCreateHumanVisible(false)} />
              <Button title="Save" onPress={createHumanNPC} />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: "#00d9ff",
    fontSize: 22,
    fontWeight: "bold",
  },
  logout: {
    color: "#ff4d4d",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1e3a5f",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    color: "#aaa",
  },
  value: {
    color: "#00d9ff",
    fontSize: 18,
  },
  columns: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
    backgroundColor: "#1e3a5f",
    padding: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    color: "#00d9ff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#1e2a4a",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  userCard: {
    backgroundColor: "#1e2a4a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
  },
  email: {
    color: "#aaa",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  actionBtn: {
    color: "#00d9ff",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#00d9ff",
    padding: 14,
    borderRadius: 50,
  },
  fabText: {
    fontWeight: "bold",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 16,
  },
  modalBox: {
    backgroundColor: "#1e2a4a",
    padding: 16,
    borderRadius: 12,
  },
  modalTitle: {
    color: "#00d9ff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
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
  modalContainer: {
    backgroundColor: "#1e2a4a",
    padding: 16,
    borderRadius: 12,
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
  cardLabel: {
    color: "#0ff",
    fontSize: 12,
  },
});
