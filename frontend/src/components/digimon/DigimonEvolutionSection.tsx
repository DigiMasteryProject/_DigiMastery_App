import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "../../services/api";
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
  const [nameMap, setNameMap] = useState<Record<number, string>>({});

  /* ================= LOAD NAME MAP ================= */
  const fetchNames = async () => {
    const res = await api.get(`/digimon`);
    const list = Array.isArray(res?.datos) ? res.datos : [];

    const map: Record<number, string> = {};
    list.forEach((d: any) => {
      const id = d.id ?? d.digimon_id ?? d.id_digimon;
      const name = d.name ?? d.nombre;
      if (id != null) map[id] = name;
    });

    return map; // 👈 IMPORTANTE: devolverlo
  };

  const getName = (id: number, map: Record<number, string>) => {
    return map[id] ?? `#${id}`;
  };

  /* ================= BUILD UNIFIED LIST ================= */
  const buildUnifiedList = (
    prev: any[],
    next: any[],
    map: Record<number, string>
  ) => {
    const prevMapped = prev.map((evo) => ({
      id: evo.base_digimon_id,
      name: getName(evo.base_digimon_id, map),
      type: "prev" as const,
    }));

    const nextMapped = next.map((evo) => ({
      id: evo.new_digimon_id,
      name: getName(evo.new_digimon_id, map),
      type: "evo" as const,
    }));

    const unique = new Map<number, any>();

    [...prevMapped, ...nextMapped].forEach((item) => {
      unique.set(item.id, item);
    });

    return Array.from(unique.values());
  };

  /* ================= FETCH EVOLUTIONS ================= */
  const fetchData = async (map: Record<number, string>) => {
    if (!digimonId) return;

    const res1 = await api.get(`/digimon_evolution/base/${digimonId}`);
    const res2 = await api.get(`/digimon_evolution/new/${digimonId}`);

    const next = Array.isArray(res1?.datos) ? res1.datos : [];
    const prev = Array.isArray(res2?.datos) ? res2.datos : [];

    setEvolutions(next);
    setPreEvolutions(prev);

    const unified = buildUnifiedList(prev, next, map);

    onDataLoaded?.({
      evolutionOptions: unified,
    });
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (!digimonId) return;

    const load = async () => {
      const map = await fetchNames(); // 👈 ahora SÍ es seguro
      setNameMap(map); // opcional (UI)
      await fetchData(map); // 👈 usamos el map directo
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
              {getName(evo.base_digimon_id, nameMap)}
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
              {getName(evo.new_digimon_id, nameMap)}
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