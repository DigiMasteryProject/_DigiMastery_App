import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

// ========================================
// TYPES
// ========================================

export interface Digimon {
  id: number;
  name: string;
  family_tree: string;
  attribute: string;
  element: string;
  growth_phase: string;

  health_points: number;
  skill_points: number;

  attack: number;
  defense: number;
  spirit: number;
  speed: number;
}

export interface Skill {
  id_skill: number;
  name: string;
  type: string;
  element: string;
  description: string;
  MP_Cost: number;
}

export interface DigimonEvolution {
  id_evo: number;

  base_digimon_id: number;
  new_digimon_id: number;

  evo_condition: string;
  slot: number;
}

// ========================================
// CONTEXT TYPE
// ========================================

interface GameDataContextType {
  loading: boolean;

  digimon: Digimon[];
  skills: Skill[];
  evolutions: DigimonEvolution[];

  digimonMap: Record<number, Digimon>;
  skillMap: Record<number, Skill>;

  refreshGameData: () => Promise<void>;
}

// ========================================
// CONTEXT
// ========================================

const GameDataContext = createContext<GameDataContextType>({
  loading: true,

  digimon: [],
  skills: [],
  evolutions: [],

  digimonMap: {},
  skillMap: {},

  refreshGameData: async () => {},
});

// ========================================
// PROVIDER
// ========================================

export const GameDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);

  const [digimon, setDigimon] = useState<Digimon[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [evolutions, setEvolutions] = useState<
    DigimonEvolution[]
  >([]);

  // ========================================
  // FETCH
  // ========================================

  const fetchGameData = async () => {
    try {
      setLoading(true);

      // =========================
      // 1. LOAD CACHE
      // =========================

      const cached = await AsyncStorage.getItem(
        "game_data_cache"
      );

      if (cached) {
        const parsed = JSON.parse(cached);

        setDigimon(parsed.digimon || []);
        setSkills(parsed.skills || []);
        setEvolutions(parsed.evolutions || []);
      }

      // =========================
      // 2. FETCH FRESH DATA
      // =========================

      const [
        digimonRes,
        skillsRes,
        evolutionsRes,
      ] = await Promise.all([
        api.get("/digimon"),
        api.get("/skill"),
        api.get("/digimon_evolution"),
      ]);

      const freshData = {
        digimon: digimonRes.datos || [],
        skills: skillsRes.datos || [],
        evolutions: evolutionsRes.datos || [],
      };

      // =========================
      // 3. UPDATE STATE
      // =========================

      setDigimon(freshData.digimon);
      setSkills(freshData.skills);
      setEvolutions(freshData.evolutions);

      // =========================
      // 4. SAVE CACHE
      // =========================

      await AsyncStorage.setItem(
        "game_data_cache",
        JSON.stringify(freshData)
      );
    } catch (err) {
      console.error("Error loading game data", err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchGameData();
  }, []);

  // ========================================
  // MAPS
  // ========================================

  const digimonMap = useMemo(
  () =>
    Object.fromEntries(
      digimon.map((d) => [d.id, d])
    ) as Record<number, typeof digimon[number]>,
  [digimon]
);

  const skillMap = useMemo(() => {
    return Object.fromEntries(
      skills.map((s) => [s.id_skill, s])
    ) as Record<number, typeof skills[number]>;
  }, [skills]);

  // ========================================
  // PROVIDER
  // ========================================

  return (
    <GameDataContext.Provider
      value={{
        loading,

        digimon,
        skills,
        evolutions,

        digimonMap,
        skillMap,

        refreshGameData: fetchGameData,
      }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

// ========================================
// HOOK
// ========================================

export const useGameData = () =>
  useContext(GameDataContext);