import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
    Platform
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import api from "../src/services/api";

export default function OptionsScreen() {
  const [userModal, setUserModal] = useState(false);
  const [suggestionModal, setSuggestionModal] = useState(false);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

   const getUserId = async () => {
  try {
    let userData =
      Platform.OS === "web"
        ? localStorage.getItem("user")
        : await SecureStore.getItemAsync("user");

    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    }
  } catch (err) {
    console.log("Error leyendo usuario:", err);
  }
};
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [suggestion, setSuggestion] = useState("");

  // 🔹 EDIT USER (PATCH parcial)
  const updateUser = async () => {
    try {
      const payload: any = {};

      if (userData.username) payload.username = userData.username;
      if (userData.email) payload.email = userData.email;
      if (userData.password) payload.password = userData.password;

      if (Object.keys(payload).length === 0) {
        Alert.alert("Info", "No changes to update");
        return;
      }

      await api.put(`/user/${currentUser.id}`, payload);

      const updatedUser = {
  ...currentUser,
  ...payload,
};

setCurrentUser(updatedUser);

if (Platform.OS === "web") {
  localStorage.setItem("user", JSON.stringify(updatedUser));
} else {
  await SecureStore.setItemAsync(
    "user",
    JSON.stringify(updatedUser)
  );
}

      Alert.alert("OK", "User updated successfully");
      setUserModal(false);
      setUserData({ username: "", email: "", password: "" });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not update user");
    }
  };
  
 const logout = async () => {
  try {
    // Mobile (SecureStore)
    if (Platform.OS !== "web") {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");
    }

    // Web (localStorage)
    if (Platform.OS === "web") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    router.replace("/login");
  } catch (err) {
    console.log("Logout error:", err);
  }
};
  // 🔹 MANUAL DOWNLOAD
  const openManual = () => {
    const url = "https://drive.google.com/drive/folders/1PlcshWeGZwb2xomqtINILsTS5wm3UQOz?usp=sharing";
    Linking.openURL(url);
  };

  // 🔹 SEND SUGGESTION EMAIL
const sendSuggestion = async () => {
  try {
    if (!suggestion) return;

    if (!currentUser) {
      Alert.alert("Error", "User not loaded");
      return;
    }

    console.log("Sending suggestion:", {
      from: currentUser.email,
      username: currentUser.username,
      userId: currentUser.id,
      message: suggestion,
    });

    await api.post("/suggestions", {
      from: currentUser.email,
      username: currentUser.username,
      userId: currentUser.id,
      message: suggestion,
    });

    Alert.alert("Sent", "Suggestion sent successfully");

    setSuggestion("");
    setSuggestionModal(false);

  } catch (err) {
    console.log(err);
    Alert.alert("Error", "Could not send suggestion");
  }
};
  useEffect(() => {
  getUserId();
}, []);

  return (
    <LinearGradient colors={["#0a0e1f", "#1a2342", "#2d3561"]} style={styles.container}>
      
      {/* TOPBAR */}
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1e3a5f",
    padding: 10,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#2a4563",
  }}
>
  <TouchableOpacity
    onPress={() => router.back()}
    style={{ flexDirection: "row", alignItems: "center" }}
  >
    <Feather name="arrow-left" size={18} color="#00d9ff" />
    <Text style={{ color: "#00d9ff", marginLeft: 4, fontWeight: "bold" }}>
      BACK
    </Text>
  </TouchableOpacity>

  <View style={{ flex: 1, alignItems: "center" }}>
    <Text style={styles.title}>OPTIONS</Text>
  </View>

  <View style={{ width: 60 }} />
</View>

      {/* 🔹 EDIT USER */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setUserModal(true)}
      >
        <Feather name="user" size={18} color="#00d9ff" />
        <Text style={styles.buttonText}>EDIT USER</Text>
      </TouchableOpacity>

      {/* 🔹 MANUAL */}
      <TouchableOpacity style={styles.button} onPress={openManual}>
        <Feather name="book" size={18} color="#00d9ff" />
        <Text style={styles.buttonText}>DOWNLOAD MANUAL</Text>
      </TouchableOpacity>

      {/* 🔹 SUGGESTIONS */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setSuggestionModal(true)}
      >
        <Feather name="mail" size={18} color="#00d9ff" />
        <Text style={styles.buttonText}>SUGGESTIONS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}
  onPress={logout}
>
  <Text style={styles.buttonText}>LOGOUT</Text>
</TouchableOpacity>

      {/* ================= EDIT USER MODAL ================= */}
      <Modal visible={userModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit User</Text>

            <TextInput
              placeholder="Username"
              value={userData.username}
              onChangeText={(t) => setUserData({ ...userData, username: t })}
              style={styles.input}
            />

            <TextInput
              placeholder="Email"
              value={userData.email}
              onChangeText={(t) => setUserData({ ...userData, email: t })}
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              value={userData.password}
              onChangeText={(t) => setUserData({ ...userData, password: t })}
              style={styles.input}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={updateUser}>
              <Text style={styles.saveText}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setUserModal(false)}>
              <Text style={{ color: "#ff6699", marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= SUGGESTION MODAL ================= */}
      <Modal visible={suggestionModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Send Suggestion</Text>

            <TextInput
              placeholder="Write your suggestion..."
              value={suggestion}
              onChangeText={setSuggestion}
              multiline
              style={[styles.input, { height: 120 }]}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={sendSuggestion}>
              <Text style={styles.saveText}>SEND</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSuggestionModal(false)}>
              <Text style={{ color: "#ff6699", marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
  },

  title: {
    color: "#00d9ff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e3a5f",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a4563",
    gap: 10,
  },

  buttonText: {
    color: "#00d9ff",
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#00d9ff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  saveText: {
    color: "#0a1628",
    fontWeight: "bold",
  },
});