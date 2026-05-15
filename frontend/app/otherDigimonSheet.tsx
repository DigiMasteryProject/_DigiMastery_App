import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../src/components/digimon/Styles";

import api from "../src/services/api";

import DigimonEvolutionSection from "../src/components/digimon/DigimonEvolutionSection";
import DigimonEditModal from "../src/components/digimon/DigimonEditModal";
import StatBox from "../src/components/digimon/StatBox";
import StatBox2 from "../src/components/digimon/StatBox2";
import DigimonSkills from "@/src/components/digimon/DigimonSkills";

/* ================= SCREEN ================= */

export default function DigimonSheet() {
  const params = useLocalSearchParams<{ digimonId?: string }>();
    const digimonId = Number(params.digimonId);
  
    const router = useRouter();
  
    const [digimon, setDigimon] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    const [editVisible, setEditVisible] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [speciesSearch, setSpeciesSearch] = useState("");
    const [evolutionOptions, setEvolutionOptions] = useState<any[]>([]);
  
    const [allSpecies, setAllSpecies] = useState<any[]>([]);

  const fetchDigimon = async () => {
    try {
      setLoading(true);

      // 1️⃣ OTHER DIGIMON (source of truth for level + EVs)
      const otherRes = await api.get(`/other_digimon/${digimonId}`);
      const other = otherRes.datos;

      // 2️⃣ SPECIES ID
      const speciesId = other.id_digimon;

      // 3️⃣ DIGIMON SPECIES
      const res2 = await api.get(`/digimon/${speciesId}`);
      const d = res2.datos;

      setDigimon({
        ...d,
        id: speciesId,
        nickname: other.nickname,
        level: other.level,

        attack_evs: other.atk_ev,
        defense_evs: other.def_ev,
        speed_evs: other.speed_ev,
        spirit_evs: other.spirit_ev,
      });
    } catch (err) {
      console.log("Error fetching digimon:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const fetchSpeciesList = async () => {
  try {
    const res = await api.get("/digimon");
    const data = Array.isArray(res?.datos) ? res.datos : [];
    setAllSpecies(data); 
  } catch (err) {
    console.log("Error fetching species:", err);
    setAllSpecies([]);
  }
};

 useEffect(() => {
     if (!digimonId) return;
 
     fetchDigimon();
     fetchSpeciesList();
   }, [digimonId]);
  /* ================= LOADING ================= */

  if (!digimonId)
    return <Text style={styles.error}>No se ha seleccionado ningún Digimon</Text>;

  if (loading)
    return <ActivityIndicator size="large" color="#0ff" style={{ marginTop: 40 }} />;

  if (!digimon)
    return <Text style={styles.error}>No se encontraron datos del Digimon</Text>;

    const openEditModal = () => {
    setEditData({
      nickname: digimon.nickname || "",
      level: digimon.level || 1,
      atk_ev: digimon.attack_evs || 0,
      def_ev: digimon.defense_evs || 0,
      spe_ev: digimon.speed_evs || 0,
      spirit_ev: digimon.spirit_evs || 0,
      friendship: digimon.friendship || 0,
      id_digimon: digimon.id_digimon || 0,
    });

    setEditVisible(true);
  };


  /* ================= UI (NO CHANGES) ================= */

  return (
    <LinearGradient colors={["#0a0e1f", "#1a2342", "#2d3561"]} style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          padding: 8,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "#0ff", fontWeight: "bold" }}>Close</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openEditModal}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          padding: 8,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "#0ff", fontWeight: "bold" }}>Edit</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={{ alignItems: "center", paddingVertical: 12 }}>
          <Text style={styles.digimonName}>{digimon.name?.toUpperCase()}</Text>
          <Text style={styles.digimonSpecies}>
            (Lv {digimon.level})
          </Text>
          <Text style={styles.subHeaderSmall}>
            Attribute: {digimon.attribute} | Element: {digimon.element}
          </Text>
          <Text style={styles.subHeaderSmall}>
            Growth Phase: {digimon.growth_phase}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <StatBox label="HP" value={digimon.health_points} level={digimon.level} color="#f9a" />
          <StatBox label="SP" value={digimon.skill_points} level={digimon.level} color="#39f" />
        </View>

        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <StatBox2 label="ATK" value1={digimon.attack} value2={digimon.attack_evs} level={digimon.level} color="#f90" />
          <StatBox2 label="DEF" value1={digimon.defense} value2={digimon.defense_evs} level={digimon.level} color="#0f0" />
        </View>

        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          <StatBox2 label="SPIRIT" value1={digimon.spirit} value2={digimon.spirit_evs} level={digimon.level} color="#90f" />
          <StatBox2 label="SPD" value1={digimon.speed} value2={digimon.speed_evs} level={digimon.level} color="#ff0" />
        </View>

 {/* SKILLS (te faltaba esto) */}
        <DigimonSkills skills={digimon.skills} />

        {/* EVOLUTIONS */}
        <DigimonEvolutionSection
          digimonId={digimon.id}
          allSpecies={allSpecies}
          onDataLoaded={(data) => {
            setEvolutionOptions(data.evolutionOptions);
          }}
        />

      </ScrollView>

      {editData && (
        <DigimonEditModal
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          onSave={async () => {
            await api.put(`/other_digimon/${digimonId}`, editData);
            setEditVisible(false);
            fetchDigimon();
          }}
          editData={editData}
          setEditData={setEditData}
          speciesSearch={speciesSearch}
          setSpeciesSearch={setSpeciesSearch}
          evolutionOptions={evolutionOptions}
          showFriendship={false}
          showNickname={false}
        />
      )}
     
    </LinearGradient>
  );
}