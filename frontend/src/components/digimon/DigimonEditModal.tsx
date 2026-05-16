import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { styles } from "./Styles";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;

  editData: any | null;
  setEditData: React.Dispatch<React.SetStateAction<any>>;

  speciesSearch: string;
  setSpeciesSearch: (value: string) => void;

  evolutionOptions: any[];

  showFriendship?: boolean;
}

export default function DigimonEditModal({
  visible,
  onClose,
  onSave,

  editData,
  setEditData,

  speciesSearch,
  setSpeciesSearch,

  evolutionOptions,

  showFriendship = false,
  showNickname = true,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>

          <Text style={styles.modalTitle}>
            Edit Digimon
          </Text>

          {/* 🔒 SAFE ACCESS INLINE (NO RETURN NULL) */}

          {showNickname && (
            <>
              <Text style={styles.cardLabel}>Nickname</Text>
              <TextInput
                value={editData?.nickname ?? ""}
                onChangeText={(t) =>
                  setEditData((d: any) => ({
                    ...d,
                nickname: t,
              }))
            }
            style={styles.input}
          />
            </>
          )}

          <Text style={styles.cardLabel}>Level</Text>
          <TextInput
            keyboardType="numeric"
            value={String(editData?.level ?? 1)}
            onChangeText={(t) =>
              setEditData((d: any) => ({
                ...d,
                level: Number(t),
              }))
            }
            style={styles.input}
          />

          {/* ATK / DEF */}
          <View style={styles.row}>
            <View style={styles.halfInputLeft}>
              <Text style={styles.cardLabel}>ATK EV</Text>
              <TextInput
                keyboardType="numeric"
                value={String(editData?.atk_ev ?? 0)}
                onChangeText={(t) =>
                  setEditData((d: any) => ({
                    ...d,
                    atk_ev: Number(t),
                  }))
                }
                style={styles.input}
              />
            </View>

            <View style={styles.halfInputRight}>
              <Text style={styles.cardLabel}>DEF EV</Text>
              <TextInput
                keyboardType="numeric"
                value={String(editData?.def_ev ?? 0)}
                onChangeText={(t) =>
                  setEditData((d: any) => ({
                    ...d,
                    def_ev: Number(t),
                  }))
                }
                style={styles.input}
              />
            </View>
          </View>

          {/* SPD / SPIRIT */}
          <View style={styles.row}>
            <View style={styles.halfInputLeft}>
              <Text style={styles.cardLabel}>SPD EV</Text>
              <TextInput
                keyboardType="numeric"
                value={String(editData?.spe_ev ?? 0)}
                onChangeText={(t) =>
                  setEditData((d: any) => ({
                    ...d,
                    spe_ev: Number(t),
                  }))
                }
                style={styles.input}
              />
            </View>

            <View style={styles.halfInputRight}>
              <Text style={styles.cardLabel}>SPIRIT EV</Text>
              <TextInput
                keyboardType="numeric"
                value={String(editData?.spirit_ev ?? 0)}
                onChangeText={(t) =>
                  setEditData((d: any) => ({
                    ...d,
                    spirit_ev: Number(t),
                  }))
                }
                style={styles.input}
              />
            </View>
          </View>

          {/* FRIENDSHIP */}
          {showFriendship && (
            <>
              <Text style={styles.cardLabel}>Friendship</Text>
              <TextInput
                keyboardType="numeric"
                value={String(editData?.friendship ?? 0)}
                onChangeText={(t) =>
                  setEditData((d: any) => ({
                    ...d,
                    friendship: Number(t),
                  }))
                }
                style={styles.input}
              />
            </>
          )}

          {/* SEARCH */}
          <Text style={styles.cardLabel}>Species</Text>

          <TextInput
            placeholder="Search species..."
            value={speciesSearch}
            onChangeText={setSpeciesSearch}
            style={styles.input}
          />

          {/* PICKER */}
          <Picker
            selectedValue={editData?.id_digimon ?? 0}
            onValueChange={(itemValue) =>
              setEditData((d: any) => ({
                ...d,
                id_digimon: Number(itemValue),
              }))
            }
            style={styles.input}
          >
            <Picker.Item label="-- Select Species --" value={0}  color="000"/>

            {evolutionOptions?.map((item) => (
               <Picker.Item
      key={item.id}
      label={item.name}
      value={item.id}
      color="#000"
    />
            ))}
          </Picker>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={onSave} />
          </View>

        </View>
      </View>
    </Modal>
  );
}