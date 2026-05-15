import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import api from "../src/services/api";

const SCREEN_WIDTH = Dimensions.get("window").width;

type CodeShard = {
  id_shard: number;
  id_uc: number;
  slot_1: number;
  slot_2: number;
  slot_3: number;
  slot_4: number;
  slot_5: number;
  slot_6: number;
};

type Reward = {
  id: number;
  slot_1: number;
  slot_2: number;
  slot_3: number;
  slot_4: number;
  slot_5: number;
  slot_6: number;
  name: string;
  code: string;
};

export default function DigiMasteryScreen() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const user = Number(params.userId);

  const router = useRouter();

  const [codeShard, setCodeShard] = useState<CodeShard[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const [selectedFragment, setSelectedFragment] = useState<string>("");
  const [unlockedPositions, setUnlockedPositions] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);
  const [rewardUnlocked, setRewardUnlocked] = useState<Reward | null>(null);

  // Traer fragments
  useEffect(() => {
    const fetchShards = async () => {
      try {
        const res = await api.get(`/code_shard/user/${user}`);
        setCodeShard(res.datos ?? []);
      } catch (error) {
        console.error("Error fetching shards:", error);
      }
    };

    if (user) fetchShards();
  }, [user]);

  // Traer rewards
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.get(`/reward`);
        setRewards(res.datos ?? []);
        console.log("Fetched rewards:", res.datos);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };

    if (user) fetchRewards();
  }, [user]);

  const handleSelectReward = (reward: Reward) => {
    const fullCode = `${reward.slot_1}${reward.slot_2}${reward.slot_3}${reward.slot_4}${reward.slot_5}${reward.slot_6}`;

    setSelectedReward({
      ...reward,
      code: fullCode,
    });

    setUnlockedPositions(new Set());
    setProgress(0);
    setSelectedFragment("");
  };

  const handleSubmit = () => {
    if (!selectedReward) {
      console.warn("No reward selected!");
      return;
    }

    if (!selectedFragment) {
      console.warn("Select a shard!");
      return;
    }

    const TARGET_CODE = selectedReward.code;

    const newUnlocked = new Set(unlockedPositions);

    for (
      let i = 0;
      i < Math.min(TARGET_CODE.length, selectedFragment.length);
      i++
    ) {
      if (selectedFragment[i] === TARGET_CODE[i]) {
        newUnlocked.add(i);
      }
    }

    setUnlockedPositions(newUnlocked);
    setProgress(newUnlocked.size);

    setSelectedFragment("");

    if (newUnlocked.size === TARGET_CODE.length) {
      setRewardUnlocked(selectedReward);
    }
  };

  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* TOPBAR */}
        <View
          style={{
            backgroundColor: "#1e3a5f",
            borderWidth: 3,
            borderColor: "#2a4563",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 4,
            marginBottom: 16,
            width: "100%",
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
              <Text
                style={{
                  color: "#00d9ff",
                  fontSize: 18,
                  marginLeft: 4,
                }}
              >
                BACK
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  color: "#00d9ff",
                  fontWeight: "bold",
                  fontSize: 28,
                  textShadowColor: "#3f1058",
                  textShadowOffset: { width: 4, height: 4 },
                  textShadowRadius: 1,
                }}
              >
                CODE REDEEM
              </Text>
            </View>

            <View style={{ width: 60 }} />
          </View>
        </View>

        <Text style={styles.titleCyan}>Digi</Text>
        <Text style={styles.titleOrange}>Mastery</Text>
        <Text style={styles.subtitle}>UNLOCK YOUR REWARD</Text>

        {/* Reward selector */}
        <View style={{ width: "100%", marginBottom: 12 }}>
          <Text style={styles.fragmentLabel}>SELECT REWARD</Text>

          <Picker
            selectedValue={selectedReward?.id ?? 0}
            onValueChange={(itemValue) => {
              const rewardId = Number(itemValue);
              const reward = rewards.find((r) => r.id === rewardId);

              if (reward) handleSelectReward(reward);
            }}
            style={styles.picker}
            dropdownIconColor="#00d9ff"
            mode="dropdown"
          >
            <Picker.Item label="-- Select Reward --" value={0} />

            {rewards.map((reward) => (
              <Picker.Item
                key={reward.id}
                label={`Reward - ${reward.id}`}
                value={reward.id}
              />
            ))}
          </Picker>
        </View>

        {/* Código */}
        {selectedReward?.code && (
          <View style={styles.targetContainer}>
            <Text style={styles.targetLabel}>REWARD CODE:</Text>

            <View style={styles.codeRow}>
              {selectedReward.code.split("").map((digit, index) => {
                const unlocked = unlockedPositions.has(index);

                return (
                  <View
                    key={index}
                    style={[
                      styles.codeBox,
                      unlocked
                        ? styles.codeBoxUnlocked
                        : styles.codeBoxLocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.codeDigit,
                        unlocked
                          ? styles.codeDigitUnlocked
                          : styles.codeDigitLocked,
                      ]}
                    >
                      {unlocked ? digit : "?"}
                    </Text>

                    {!unlocked && (
                      <Text style={styles.lockIcon}>🔒</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Shards */}
        <View style={{ width: "100%" }}>
          <Text style={styles.fragmentLabel}>SELECT SHARD</Text>

          {codeShard.map((frag) => {
            const fragCode = `${frag.slot_1}${frag.slot_2}${frag.slot_3}${frag.slot_4}${frag.slot_5}${frag.slot_6}`;

            return (
              <TouchableOpacity
                key={frag.id_shard}
                onPress={() => setSelectedFragment(fragCode)}
                style={[
                  styles.fragmentButton,
                  selectedFragment === fragCode &&
                    styles.fragmentButtonActive,
                ]}
              >
                <Text style={styles.fragmentText}>
                  [ {fragCode} ]
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>▶ REDEEM</Text>
        </TouchableOpacity>

        {/* Progress */}
        {selectedReward && (
          <>
            <Text style={styles.progressText}>
              PROGRESS: {progress}/
              {selectedReward.code?.length || 0}
            </Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${
                      selectedReward.code
                        ? (progress /
                            selectedReward.code.length) *
                          100
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
          </>
        )}

        {/* Notes */}
        <Text style={styles.noteText}>
          Use code shards from your inventory to unlock
          the reward code. Each correct digit unlocks a
          position.
        </Text>

        <Text style={styles.noteText}>
          Inventory: {codeShard.length} shards available
        </Text>

        {/* Modal */}
        <Modal
          transparent
          visible={!!rewardUnlocked}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#0a1628",
                padding: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: "#00d9ff",
                alignItems: "center",
                width: "80%",
              }}
            >
              <Text
                style={{
                  color: "#00ff00",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                🎉 Reward Unlocked!
              </Text>

              <Text
                style={{
                  color: "#00d9ff",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {rewardUnlocked?.name}
              </Text>

              <Pressable
                onPress={() => setRewardUnlocked(null)}
                style={{
                  backgroundColor: "#00d9ff",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: "#0a1628",
                    fontWeight: "bold",
                  }}
                >
                  OK
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    minHeight: "100%",
  },

  titleCyan: {
    fontSize: 32,
    color: "#00ffff",
    fontWeight: "bold",
  },

  titleOrange: {
    fontSize: 36,
    color: "#ff8c00",
    fontWeight: "bold",
    marginBottom: 16,
  },

  subtitle: {
    color: "#00d9ff",
    marginBottom: 16,
  },

  targetContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#00d9ff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },

  targetLabel: {
    color: "#00d9ff",
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },

  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  codeBox: {
    width: SCREEN_WIDTH / 10,
    height: SCREEN_WIDTH / 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  codeBoxLocked: {
    backgroundColor: "rgba(10,22,40,0.6)",
    borderWidth: 2,
    borderColor: "rgba(0,217,255,0.3)",
  },

  codeBoxUnlocked: {
    backgroundColor: "rgba(0,217,255,0.2)",
    borderWidth: 2,
    borderColor: "#00d9ff",
  },

  codeDigit: {
    fontSize: 40,
    fontWeight: "bold",
  },

  codeDigitLocked: {
    color: "rgba(0,217,255,0.3)",
  },

  codeDigitUnlocked: {
    color: "#00ff00",
    textShadowColor: "#00ff00",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  lockIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 10,
    color: "rgba(0,217,255,0.5)",
  },

  fragmentLabel: {
    color: "#00d9ff",
    marginBottom: 4,
    fontSize: 12,
  },

  fragmentButton: {
    backgroundColor: "rgba(10,22,40,0.8)",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#00d9ff",
    marginVertical: 2,
  },

  fragmentButtonActive: {
    borderColor: "#00ff00",
  },

  fragmentText: {
    color: "#29efec",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },

  submitButton: {
    backgroundColor: "#00d9ff",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 8,
  },

  submitText: {
    fontWeight: "bold",
    color: "#0a1628",
    fontSize: 14,
  },

  progressText: {
    color: "#00d9ff",
    alignSelf: "flex-start",
    marginBottom: 4,
  },

  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(10,22,40,0.8)",
    borderRadius: 4,
    marginBottom: 8,
  },

  progressBarFill: {
    height: 8,
    backgroundColor: "#00ff00",
    borderRadius: 4,
  },

  noteText: {
    color: "#00d9ff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },

  picker: {
    color: "#00d9ff",
    backgroundColor: "rgba(10,22,40,0.8)",
    borderWidth: 2,
    borderColor: "#00d9ff",
    borderRadius: 4,
  },
});