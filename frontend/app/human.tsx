import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, SafeAreaView, Image, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { Heart } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../src/services/api";
import { getHumanArchetype } from "../src/components/human/HumanArchetypeCalc";
import { EMBLEMS } from "../src/components/human/Emblems";

type HumanData = {
  id: number;
  name: string;
  archetype: string;
  darkness: number; // 0-100
  courage: number;
  skill: number;
  intelligence: number;
  serenity: number;
  perception: number;
  strength: number;
  emblem: string;
};

export default function HumanSheet() {
  const params = useLocalSearchParams<{ humanId?: string }>();
  const humanId = params.humanId ? parseInt(params.humanId, 10) : undefined;
  const router = useRouter();

  const [humanData, setHumanData] = useState<HumanData | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Estados para edición ---
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState({
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

  // --- Función para abrir modal ---
  const openEditModal = () => {
    if (!humanData) return;
    setEditData({
      name: humanData.name,
      archetype: humanData.archetype,
      darkness: humanData.darkness,
      courage: humanData.courage,
      skill: humanData.skill,
      intelligence: humanData.intelligence,
      serenity: humanData.serenity,
      perception: humanData.perception,
      strength: humanData.strength,
    });
    setEditVisible(true);
  };

  // --- Función para recargar datos ---
  const fetchHumanData = async () => {
    if (!humanId) return;
    try {
      setLoading(true);
      const res = await api.get(`/human/${humanId}`);
      setHumanData(res.datos);
    } catch (err) {
      console.log("Error fetching human:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Guardar edición ---
  const saveEdit = async () => {
    editData.archetype = getHumanArchetype({
      courage: editData.courage,
      skill: editData.skill,
      intelligence: editData.intelligence,
      serenity: editData.serenity,
      perception: editData.perception,
      strength: editData.strength,
    });
    try {
      await api.put(`/human/${humanId}`, editData);
      setEditVisible(false);
      fetchHumanData(); // recarga los datos automáticamente
    } catch (err) {
      console.log("Error al guardar cambios del humano:", err);
    }
  };

  useEffect(() => {
    fetchHumanData();
  }, [humanId]);

  if (!humanId) return <Text style={styles.error}>No human selected</Text>;
  if (loading) return <ActivityIndicator size="large" color="#0ff" style={{ marginTop: 40 }} />;
  if (!humanData) return <Text style={styles.error}>Human not found</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0e1f" }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: "absolute", top: 16, left: 16, zIndex: 10, padding: 8, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 6 }}
      >
        <Text style={{ color: "#0ff", fontWeight: "bold" }}>Close</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openEditModal}
        style={{ position: "absolute", top: 16, right: 16, zIndex: 10, padding: 8, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 6 }}
      >
        <Text style={{ color: "#0ff", fontWeight: "bold" }}>Edit</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Text style={styles.header}>{humanData.name}</Text>
        </View>

        {/* Archetype & Darkness */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>◆ Archetype</Text>
            <Text style={styles.cardValue}>{humanData.archetype}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Heart color="rgb(197, 56, 197)" size={14} />
              <Text style={[styles.cardLabel, { marginLeft: 4 }]}>Darkness</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${humanData.darkness}%` }]} />
            </View>
            <Text style={styles.progressText}>{humanData.darkness}%</Text>
          </View>
        </View>

        {/* Stats Grid 2 columnas */}
        <View style={styles.statsContainer}>
          <StatBox label="Courage" value={humanData.courage} color="#f55" />
          <StatBox label="Skill" value={humanData.skill} color="#39f" />
          <StatBox label="Intelligence" value={humanData.intelligence} color="#90f" />
          <StatBox label="Serenity" value={humanData.serenity} color="#0f0" />
          <StatBox label="Perception" value={humanData.perception} color="#ff0" />
          <StatBox label="Strength" value={humanData.strength} color="#f90" />
        </View>

        <View style={{ flexDirection: "column", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Emblem</Text>
            <Text style={styles.cardValue}>{humanData.emblem}</Text>
            <Image source={{ uri: EMBLEMS[humanData.emblem] }} style={{ width: 80, height: 80, marginTop: 8 }} />
          </View>
        </View>
      </ScrollView>

      {/* Modal de edición */}
      <Modal visible={editVisible} animationType="slide" transparent>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.7)", padding: 16 }}>
        <View style={{ backgroundColor: "#1e2a4a", padding: 16, borderRadius: 12 }}>
          <Text style={{ color: "#0ff", fontWeight: "bold", marginBottom: 16, fontSize: 18 }}>Edit Human</Text>

          {/* Nombre */}
          <Text style={[styles.cardLabel, { marginBottom: 4 }]}>Name</Text>
          <TextInput
            placeholder="Name"
            value={editData.name}
            onChangeText={t => setEditData(d => ({ ...d, name: t }))}
            style={{ backgroundColor: "#fff", marginBottom: 12, padding: 8, borderRadius: 4 }}
          />

          {/* Darkness y Archetype */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.cardLabel}>Darkness (%)</Text>
              <TextInput
                placeholder="Darkness"
                keyboardType="numeric"
                value={String(editData.darkness)}
                onChangeText={t => setEditData(d => ({ ...d, darkness: Number(t) }))}
                style={{ backgroundColor: "#fff", padding: 8, borderRadius: 4 }}
              />
            </View>
          </View>

          {/* Stats agrupadas de 2 en 2 */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.cardLabel}>Courage</Text>
              <TextInput
                placeholder="Courage"
                keyboardType="numeric"
                value={String(editData.courage)}
                onChangeText={t => setEditData(d => ({ ...d, courage: Number(t) }))}
                style={{ backgroundColor: "#fff", padding: 8, borderRadius: 4 }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.cardLabel}>Skill</Text>
              <TextInput
                placeholder="Skill"
                keyboardType="numeric"
                value={String(editData.skill)}
                onChangeText={t => setEditData(d => ({ ...d, skill: Number(t) }))}
                style={{ backgroundColor: "#fff", padding: 8, borderRadius: 4 }}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.cardLabel}>Intelligence</Text>
              <TextInput
                placeholder="Intelligence"
                keyboardType="numeric"
                value={String(editData.intelligence)}
                onChangeText={t => setEditData(d => ({ ...d, intelligence: Number(t) }))}
                style={{ backgroundColor: "#fff", padding: 8, borderRadius: 4 }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.cardLabel}>Serenity</Text>
              <TextInput
                placeholder="Serenity"
                keyboardType="numeric"
                value={String(editData.serenity)}
                onChangeText={t => setEditData(d => ({ ...d, serenity: Number(t) }))}
                style={{ backgroundColor: "#fff", padding: 8, borderRadius: 4 }}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.cardLabel}>Perception</Text>
              <TextInput
                placeholder="Perception"
                keyboardType="numeric"
                value={String(editData.perception)}
                onChangeText={t => setEditData(d => ({ ...d, perception: Number(t) }))}
                style={{ backgroundColor: "#fff", padding: 8, borderRadius: 4 }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.cardLabel}>Strength</Text>
              <TextInput
                placeholder="Strength"
                keyboardType="numeric"
                value={String(editData.strength)}
                onChangeText={t => setEditData(d => ({ ...d, strength: Number(t) }))}
                style={{ backgroundColor: "#fff", padding: 8, borderRadius: 4 }}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
            <Button title="Cancel" onPress={() => setEditVisible(false)} />
            <Button title="Save" onPress={saveEdit} />
          </View>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
      <Text style={[styles.statValue, { textShadowColor: color, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: "#0ff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 8,
    fontFamily: "Orbitron",
  },
  error: {
    color: "#ff5555",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#0ff",
    borderRadius: 8,
    backgroundColor: "#1e2a4a",
    marginHorizontal: 4,
  },
  cardLabel: {
    color: "#0ff",
    fontSize: 12,
    textTransform: "uppercase",
    fontFamily: "Orbitron",
    marginBottom: 4,
  },
  cardValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Orbitron",
    textTransform: "capitalize",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#0f1f35",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "rgb(171, 77, 171)",
  },
  progressText: {
    fontSize: 16,
    color: "rgb(230, 104, 211)",
    textAlign: "right",
    marginTop: 2,
    fontFamily: "Orbitron",
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%", // 2 columnas con margen
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#0ff",
    borderRadius: 8,
    backgroundColor: "#1e2a4a",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    fontFamily: "Orbitron",
    fontWeight: "bold",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Orbitron",
    textAlign: "center",
  },
});