import React, { useEffect } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";

export default function MainMenu() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = React.useState(null);

  const getUserId = async () => {
      try {
        let userData = Platform.OS === "web"
          ? localStorage.getItem("user")
          : await SecureStore.getItemAsync("user");
  
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
        }
      } catch (err) {
        console.log("Error leyendo usuario:", err);
      }
      };
  
    
    const showAlert = (title: string, message: string) => {
      if (Platform.OS === "web") window.alert(`${title}\n${message}`);
      else Alert.alert(title, message);
    };

  const [fontsLoaded] = useFonts({
    PixelFont: require("../assets/fonts/PressStart2P-Regular.ttf"),
  });

  useEffect(() => {
    getUserId();
  }, [currentUserId]);

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={["#0a0e1f", "#1a2342", "#2d3561"]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>

        {/* GLOW BACKGROUND */}
        <View style={[styles.glow, { bottom: 100, left: 40 }]} />
        <View style={[styles.glow2, { bottom: 60, right: 40 }]} />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push("/calendar")}
          >
            <MaterialIcons name="calendar-month" size={24} color="#ffa500" />
          </TouchableOpacity>

          <View style={styles.logo}>
            <Image source={{uri:"https://wikimon.net/images/archive/9/9a/20260304174715%21Koromon_vpet_dmc.gif"}} style={{width: 80, height: 80}} />          
            <Text style={[styles.logoText, { color: "#00d9ff" }]}>Digi</Text>
            <Text style={[styles.logoText, { color: "#ffa500" }]}>Mastery</Text>
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push("/settings")}
          >
            <MaterialIcons name="settings" size={22} color="#ff5599" />
          </TouchableOpacity>
        </View>

        {/* MAIN */}
        <View style={styles.main}>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/campaigns")}
          >
            <ImageBackground
                source={require("../assets/images/File_island.png")}
                style={styles.card, {borderWidth:0 }}
                imageStyle={{ opacity: 0.15 , resizeMode: "contain", alignSelf: "center", width: 90, height: 90 }}
            >
            <View style={{ alignItems: "center" }}>
            <Image
            source={require("../assets/images/File_island.png")}
            style={styles.magnamonIcon}
            />
            <Text style={[styles.cardTitle, { color: "#00d9ff" }]}>
              CAMPAIGNS
            </Text>
            <Text style={styles.cardSubtitle}>
              Active Adventures
            </Text>
            </View>
            </ImageBackground>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/characters", params: { id: currentUserId } })}
          >
            <ImageBackground
                source={require("../assets/images/magnamon-bg.png")}
                style={styles.card, {borderWidth:0 }}
                imageStyle={{ opacity: 0.15 }}
            >
            <View style={{ alignItems: "center" }}>
            <Image
            source={require("../assets/images/magnamon-bg.png")}
            style={styles.magnamonIcon}
            />

            <Text style={[styles.cardTitle, { color: "#00ff88" }]}>
                CHARACTERS
            </Text>
            <Text style={styles.cardSubtitle}>
                Your Tamers
            </Text>
            </View>
            </ImageBackground>
          </TouchableOpacity>

        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>SELECT AN OPTION</Text>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  /* GLOW EFECTO (como login) */
  glow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0,217,255,0.2)",
  },
  glow2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,165,0,0.15)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  iconBtn: {
    backgroundColor: "#1e5a8e",
    borderWidth: 2,
    borderColor: "#2a4563",
    padding: 10,
    borderRadius: 8,
  },

  logo: {
    alignItems: "center",
  },

  logoText: {
    fontFamily: "PixelFont",
    fontSize: 18,
    textShadowColor: "#000",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },

  main: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },

  card: {
    flex: 1,
    backgroundColor: "#1e5a8e",
    borderWidth: 4,
    borderColor: "#2a4563",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  cardTitle: {
    fontFamily: "PixelFont",
    fontSize: 12,
    marginTop: 10,
  },

  cardSubtitle: {
    color: "#fff",
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
    fontFamily: "PixelFont",
  },

  footer: {
    textAlign: "center",
    color: "#00d9ff",
    fontSize: 10,
    opacity: 0.6,
    fontFamily: "PixelFont",
    marginBottom: 10,
  },
  magnamonIcon: {
  width: 80,
  height: 80,
  resizeMode: "contain",
  marginBottom: 10,
},
});