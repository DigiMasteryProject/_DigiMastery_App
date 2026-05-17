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
import { Heart } from "lucide-react-native";

export default function DigimonSheet() {
  const params = useLocalSearchParams<{ digimonId?: string }>();
  const digimonId = Number(params.digimonId);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [digimon, setDigimon] = useState<any>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [speciesSearch, setSpeciesSearch] = useState("");
  const [evolutionOptions, setEvolutionOptions] = useState<any[]>([]);
  /* ================= FETCH DIGIMON ================= */

  const fetchDigimon = async () => {
  try {
    setLoading(true);

    const res = await api.get(`/partner_digimon/${digimonId}`);
    const p = res.datos;

    const res2 = await api.get(`/digimon/${p.id_digimon}`);
    const species = res2.datos;

    setDigimon({
      id_digimon: p.id_digimon,
      nickname: p.nickname,
      level: p.level,
      attack_evs: p.atk_ev,
      defense_evs: p.def_ev,
      speed_evs: p.spe_ev,
      spirit_evs: p.spirit_ev,
      friendship: p.friendship,
      species: species || {
        name: "Unknown",
        skills: [],
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
    });
    console.log("Fetched Digimon:", {
      id_digimon: p.id_digimon,
      nickname: p.nickname,
      level: p.level,
      attack_evs: p.atk_ev,
      defense_evs: p.def_ev,
      speed_evs: p.spe_ev,
      spirit_evs: p.spirit_ev,
      friendship: p.friendship,
      species,
    });

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!digimonId) return;
    fetchDigimon();
  }, [digimonId]);

  if (!digimonId) return <Text>No Digimon selected</Text>;

  if (loading || !digimon)
    return <ActivityIndicator size="large" color="#0ff" />;

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
              <Text style={styles.digimonName}>{digimon.nickname?.toUpperCase()}</Text>
              <Text style={styles.digimonSpecies}>
                (Lv {digimon.level} {digimon.species.name})
              </Text>
              <Text style={styles.subHeaderSmall}>
                Attribute: {digimon.species.attribute} | Element: {digimon.species.element}
              </Text>
              <Text style={styles.subHeaderSmall}>
                Growth Phase: {digimon.species.growth_phase}
              </Text>
            </View>
        {/* STATS */}
        <View style={{ flexDirection: "row" }}>
          <StatBox label="HP" value={digimon.species.health_points} level={digimon.level} color="#f9a" />
          <StatBox label="SP" value={digimon.species.skill_points} level={digimon.level} color="#39f" />
        </View>

        <View style={{ flexDirection: "row" }}>
          <StatBox2 label="ATK" value1={digimon.species.attack} value2={digimon.attack_evs} level={digimon.level} color="#f90" />
          <StatBox2 label="DEF" value1={digimon.species.defense} value2={digimon.defense_evs} level={digimon.level} color="#0f0" />
        </View>

        <View style={{ flexDirection: "row" }}>
          <StatBox2 label="SPIRIT" value1={digimon.species.spirit} value2={digimon.spirit_evs} level={digimon.level} color="#90f" />
          <StatBox2 label="SPD" value1={digimon.species.speed} value2={digimon.speed_evs} level={digimon.level} color="#ff0" />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Heart color="rgb(236, 22, 10)" size={14} />
              <Text style={[styles.cardLabel, { marginLeft: 4 }]}>Friendship</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${digimon.friendship}%` }]} />
            </View>
            <Text style={styles.progressText}>{digimon.friendship}%</Text>
          </View>
        </View>

        {/* SKILLS (te faltaba esto) */}
        <DigimonSkills skills={digimon.species.skills} />

        {/* EVOLUTIONS */}
        <DigimonEvolutionSection
          digimonId={digimon.id_digimon}
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
            await api.put(`/partner_digimon/${digimonId}`, editData);
            setEditVisible(false);
            fetchDigimon();
          }}
          editData={editData}
          setEditData={setEditData}
          speciesSearch={speciesSearch}
          setSpeciesSearch={setSpeciesSearch}
          evolutionOptions={evolutionOptions}
          showFriendship={true}
        />
      )}
    </LinearGradient>
  );
}