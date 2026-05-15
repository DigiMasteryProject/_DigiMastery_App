import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../src/services/api";

interface UserCampaign {
  id_uc: number;
  id_user: number;
  id_campaign: number;
  user?: {
    username: string;
  };
  human_sheet?: {
    id: number;
    name: string;
  };
  shards?: CodeShard[];
}

interface CodeShard {
  id_shard: number;
  id_uc: number;
  slot_1: number;
  slot_2: number;
  slot_3: number;
  slot_4: number;
  slot_5: number;
  slot_6: number;
}

export default function GenerateRewardsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ campaignId?: string }>();
  const campaignId = Number(params.campaignId);

  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<UserCampaign[]>([]);

  // 🔥 FETCH PLAYERS BY CAMPAIGN
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/user_campaign?campaign=${campaignId}`);
      const list: UserCampaign[] = res?.datos || [];

      const enriched = await Promise.all(
        list.map(async (uc) => {
          let user = null;
          let human = null;
          let shards: CodeShard[] = [];

          // user
          try {
            const userRes = await api.get(`/user/${uc.id_user}`);
            user = userRes?.datos;
          } catch {}

          // human
          if (uc.human_sheet) {
            try {
              const humanRes = await api.get(`/human/${uc.human_sheet}`);
              human = humanRes?.datos;
            } catch {}
          }

          // shards by id_uc
          try {
            const shardRes = await api.get(
              `/code_shard/user/${uc.id_uc}`
            );
            shards = shardRes?.datos || [];
          } catch {}

          return {
            ...uc,
            user,
            human_sheet: human,
            shards,
          };
        })
      );

      setPlayers(enriched);
    } catch (err) {
      console.log("Error loading campaign:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateShard = () => {
  const digits = [];
  for (let i = 0; i < 6; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  return {
    slot_1: digits[0],
    slot_2: digits[1],
    slot_3: digits[2],
    slot_4: digits[3],
    slot_5: digits[4],
    slot_6: digits[5],
  };
};

const createShard = async (id_uc: number) => {
  try {
    const shard = generateShard();

    await api.post("/code_shard", {
      id_uc,
      ...shard,
    });

    // refrescar datos
    fetchData();
  } catch (err) {
    console.log("Error creating shard:", err);
  }
};

  useEffect(() => {
    if (campaignId) fetchData();
  }, [campaignId]);

  const formatShard = (s: CodeShard) =>
    `${s.slot_1}${s.slot_2}${s.slot_3}${s.slot_4}${s.slot_5}${s.slot_6}`;

  const renderPlayer = ({ item }: { item: UserCampaign }) => (
    <View style={styles.card}>
      
      {/* USER */}
      <Text style={styles.username}>
        {item.user?.username || "Unknown"}
      </Text>

      {/* HUMAN */}
      <Text style={styles.human}>
        {item.human_sheet?.name || "No Human"}
      </Text>

      {/* SHARDS */}
      <Text style={styles.label}>CODE SHARDS</Text>

      {item.shards && item.shards.length > 0 ? (
        item.shards.map((s) => (
          <View key={s.id_shard} style={styles.shardBox}>
            <Text style={styles.shardText}>{formatShard(s)}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: "#ff6699" }}>No shards</Text>
      )}
      <TouchableOpacity
  onPress={() => createShard(item.id_uc)}
  style={styles.shardButton}
>
  <Text style={styles.shardButtonText}>+ SHARD</Text>
</TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#0a0e1f", "#1a2342", "#2d3561"]} style={styles.container}>
      
      {/* TOPBAR */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Feather name="arrow-left" size={18} color="#00d9ff" />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>

        <Text style={styles.title}>GENERATE REWARDS</Text>

        <View style={{ width: 60 }} />
      </View>

      {/* CONTENT */}
      {loading ? (
        <ActivityIndicator color="#00d9ff" size="large" />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => String(item.id_uc)}
          renderItem={renderPlayer}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#1e3a5f",
    padding: 10,
    borderRadius: 6,
  },

  back: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#00d9ff", marginLeft: 4 },

  title: {
    flex: 1,
    textAlign: "center",
    color: "#00d9ff",
    fontWeight: "bold",
    fontSize: 18,
  },

  card: {
    backgroundColor: "#1e3a5f",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a4563",
  },

  username: {
    color: "#ffa500",
    fontWeight: "bold",
    fontSize: 14,
  },

  human: {
    color: "#fff",
    marginBottom: 6,
  },

  label: {
    color: "#00d9ff",
    marginTop: 8,
    fontSize: 12,
  },

  shardBox: {
    padding: 6,
    marginTop: 4,
    backgroundColor: "#0a1628",
    borderRadius: 6,
  },

  shardText: {
    color: "#00d9ff",
    fontFamily: "monospace",
    textAlign: "center",
  },
  shardButton: {
  marginTop: 10,
  backgroundColor: "#00ff88",
  paddingVertical: 6,
  borderRadius: 6,
  alignItems: "center",
},

shardButtonText: {
  color: "#0a1628",
  fontWeight: "bold",
  fontSize: 12,
},
});