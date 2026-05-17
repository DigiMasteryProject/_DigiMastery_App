import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "../../services/api";
import { useGameData } from "../../contexts/GameDataContext";
import { styles } from "./Styles";

interface Props {
  digimonId?: number;

  onDataLoaded?: (data: {
    evolutionOptions: {
      id: number;
      name: string;
      type: "prev" | "evo";
    }[];
  }) => void;
}

export default function DigimonEvolutionSection({
  digimonId,
  onDataLoaded,
}: Props) {
  const [evolutions, setEvolutions] = useState<any[]>([]);
  const [preEvolutions, setPreEvolutions] = useState<any[]>([]);
  const { digimonMap } = useGameData();

  const getName = (id: number) => {
  return digimonMap?.[id]?.name ?? `#${id}`;
};

  /* ================= BUILD UNIFIED LIST ================= */
 const buildUnifiedList = (prev: any[], next: any[]) => {
  const prevMapped = prev.map((evo) => ({
    id: evo.base_digimon_id,
    name: getName(evo.base_digimon_id),
    type: "prev" as const,
  }));

  const nextMapped = next.map((evo) => ({
    id: evo.new_digimon_id,
    name: getName(evo.new_digimon_id),
    type: "evo" as const,
  }));

  const unique = new Map<number, any>();

  [...prevMapped, ...nextMapped].forEach((item) => {
    unique.set(item.id, item);
  });

  return Array.from(unique.values());
};

  /* ================= FETCH EVOLUTIONS ================= */
  const fetchData = async () => {
    if (!digimonId) return;

    const res1 = await api.get(`/digimon_evolution/base/${digimonId}`);
    const res2 = await api.get(`/digimon_evolution/new/${digimonId}`);

    const next = Array.isArray(res1?.datos) ? res1.datos : [];
    const prev = Array.isArray(res2?.datos) ? res2.datos : [];

    setEvolutions(next);
    setPreEvolutions(prev);

    const unified = buildUnifiedList(prev, next);

    onDataLoaded?.({
      evolutionOptions: unified,
    });
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
  if (!digimonId) return;

  const load = async () => {
    await fetchData();
  };

  load();
}, [digimonId]);

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>Devolutions</Text>

      {preEvolutions.length === 0 ? (
        <Text style={{ color: "#fff", fontSize: 12 }}>E G G</Text>
      ) : (
        preEvolutions.map((evo) => (
          <View key={evo.id_evo} style={styles.skillCard}>
            <Text style={{ color: "#0ff", fontWeight: "bold" }}>
              {getName(evo.base_digimon_id)}
            </Text>
            <Text style={{ color: "#aaa", fontSize: 12 }}>
              {evo.evo_condition}
            </Text>
          </View>
        ))
      )}

      <Text style={styles.label}>Evolutions</Text>

      {evolutions.length === 0 ? (
        <Text style={{ color: "#fff", fontSize: 12 }}>
          No evolutions available
        </Text>
      ) : (
        evolutions.map((evo) => (
          <View key={evo.id_evo} style={styles.skillCard}>
            <Text style={{ color: "#0ff", fontWeight: "bold" }}>
              {getName(evo.new_digimon_id)}
            </Text>
            <Text style={{ color: "#aaa", fontSize: 12 }}>
              {evo.evo_condition}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}