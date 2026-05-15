import React, { useState } from "react";
import {useFonts} from "expo-font";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  Image,
  Modal
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "../src/services/api";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    "PixelFont": require("../assets/fonts/PressStart2P-Regular.ttf"),
  });
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
const [resetEmail, setResetEmail] = useState("");
const [newPassword, setNewPassword] = useState("");

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  if (!fontsLoaded) {
    return null; // O un indicador de carga
  }

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        // LOGIN
        const data = await api.post("/auth/login", {
          username,
          password,
        });

        // 🔐 Guardar usuario (compatible web + mobile)
        if (data?.user) {
          if (Platform.OS === "web") {
              localStorage.setItem("user", JSON.stringify(data.user));
          } else {
             await SecureStore.setItemAsync("user", JSON.stringify(data.user));
          }
        }

        // 🔐 Opcional: guardar token
        if (data?.token) {
          if (Platform.OS === "web") {
            localStorage.setItem("token", data.token);
          } else {
            await SecureStore.setItemAsync("token", data.token);
          }
        }

        const isAdmin = data?.user?.role === "ADMIN";
        if (isAdmin) {
          router.replace("/admin");
          return;
        }else{
          if (data?.user?.banned) {
            showAlert("BANNED", "Your account has been banned. Contact support.");
            return;
          }else{
            router.replace("/home");
          }
        }
      } else {
        // REGISTER
        if (password !== confirmPassword) {
          showAlert("Error", "Las contraseñas no coinciden");
          return;
        }

        await api.post("/user", {
          username,
          email,
          password,
        });

        showAlert("OK", "Usuario creado correctamente");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.log(error);
      showAlert("Error", error?.mensaje || "Error en la operación");
    }
  };

  const handleResetPassword = async () => {
  try {
    if (!resetEmail || !newPassword) {
      showAlert("Error", "Fill all fields");
      return;
    }

    await api.post("/user/reset-password", {
      email: resetEmail,
      password: newPassword,
    });

    showAlert("OK", "Password updated successfully");
    setForgotModal(false);
    setResetEmail("");
    setNewPassword("");
  } catch (err: any) {
    console.log(err);
    showAlert("Error", err?.mensaje || "Reset failed");
  }
};
  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={styles.container}
    >
      {/* Glow */}
      <View style={[styles.glow, { backgroundColor: "rgba(0,217,255,0.2)", bottom: 100, left: 50 }]} />
      <View style={[styles.glow, { backgroundColor: "rgba(255,165,0,0.15)", bottom: 50, right: 50 }]} />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={{uri:"https://wikimon.net/images/archive/9/9a/20260304174715%21Koromon_vpet_dmc.gif"}} style={{width: 80, height: 80}} />  
        <Text style={[styles.logoText, { color: "#00d9ff" ,marginRight: 10}]}>Digi</Text>
        <Text style={[styles.logoText, { color: "#ffa500", marginRight:10}]}>Mastery</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, isLogin && styles.activeTabOrange]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={styles.tabText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, !isLogin && styles.activeTabOrange]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={styles.tabText}>REGISTER</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <TextInput
          placeholder="USERNAME"
          placeholderTextColor="#00d9ff"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        {!isLogin && (
          <TextInput
            placeholder="EMAIL"
            placeholderTextColor="#00d9ff"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        )}

        <TextInput
          placeholder="PASSWORD"
          placeholderTextColor="#00d9ff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {!isLogin && (
          <TextInput
            placeholder="CONFIRM PASSWORD"
            placeholderTextColor="#00d9ff"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />
        )}

        {/* Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {isLogin ? "▶ START" : "▶ CREATE"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setForgotModal(true)}>
  <Text style={{ color: "#ffa500", textAlign: "center", marginTop: 10 }}>
    FORGOT PASSWORD?
  </Text>
</TouchableOpacity>

      <Text style={styles.footer}>PRESS START TO BEGIN</Text>

      <Modal visible={forgotModal} transparent animationType="slide">
  <View style={styles.overlay}>
    <View style={styles.box}>
      <Text style={styles.title}>RESET PASSWORD</Text>

      <TextInput
        placeholder="EMAIL"
        placeholderTextColor="#00d9ff"
        value={resetEmail}
        onChangeText={setResetEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="NEW PASSWORD"
        placeholderTextColor="#00d9ff"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleResetPassword}>
        <Text style={styles.submitText}>RESET</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setForgotModal(false)}>
        <Text style={{ color: "#ff6699", marginTop: 10, textAlign: "center" }}>
          CLOSE
        </Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.4,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logoText: {
    fontWeight: "bold",
    fontFamily: "PixelFont",
    fontSize: 28,
    letterSpacing: 2,
    textShadowColor: "#3f1058",
    textShadowOffset: { width: 6, height: 6},
    textShadowRadius: 1
  },
  form: {
    width: width * 0.9,
    backgroundColor: "#1e5a8e",
    borderWidth: 4,
    borderColor: "#2a4563",
    borderRadius: 12,
    padding: 20,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3a5573",
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: "#2a4563",
  },
  activeTabOrange: {
    backgroundColor: "#ffa500",
  },
  tabText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "PixelFont",
  },
  input: {
    backgroundColor: "#2a4563",
    color: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#3a5573",
  },
  submitBtn: {
    backgroundColor: "#00d9ff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "#0099cc",
  },
  submitText: {
    textAlign: "center",
    color: "#1e5a8e",
    fontWeight: "bold",
    fontFamily: "PixelFont",
  },
  footer: {
    color: "#00d9ff",
    fontSize: 10,
    marginTop: 16,
    opacity: 0.6,
    fontFamily: "PixelFont",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 16,
  },
  box: {
    backgroundColor: "#1e2a4a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#00d9ff",
  },
  title: {
    color: "#00d9ff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
});