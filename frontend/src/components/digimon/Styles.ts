import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ================= GENERAL ================= */

  error: {
    color: "#ff5555",
    textAlign: "center",
    marginTop: 40,
  },

  label: {
    fontSize: 12,
    color: "#0ff",
    marginBottom: 6,
  },

  cardLabel: {
    color: "#0ff",
    fontSize: 12,
    marginBottom: 4,
  },

  /* ================= HEADER ================= */

  digimonName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0ff",
    textAlign: "center",
  },

  digimonSpecies: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f90",
    textAlign: "center",
  },

  subHeaderSmall: {
    fontSize: 16,
    color: "#0f0",
    textAlign: "center",
  },

  /* ================= STATS ================= */

  stat: {
    flex: 1,
    margin: 2,
    padding: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(0,255,255,0.3)",
    backgroundColor: "rgba(30,58,95,0.6)",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  /* ================= CARDS ================= */

  card: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#0ff",
    borderRadius: 8,
    backgroundColor: "#1e2a4a",
  },

  /* ================= FRIENDSHIP ================= */

  progressBarBackground: {
    height: 8,
    backgroundColor: "#0f1f35",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 6,
  },

  progressBarFill: {
    height: 8,
    backgroundColor: "rgb(248, 106, 29)",
  },

  progressText: {
    fontSize: 16,
    color: "rgb(248, 116, 54)",
    textAlign: "right",
    fontWeight: "bold",
    marginTop: 4,
  },

  /* ================= SKILLS ================= */

  skillBox: {
    borderWidth: 2,
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
    borderColor: "rgba(0,255,255,0.3)",
    backgroundColor: "rgba(30,58,95,0.6)",
  },

  skillText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },

  skillCard: {
    backgroundColor: "rgba(20,30,50,0.9)",
    borderWidth: 1,
    borderColor: "rgba(0,255,255,0.25)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  skillName: {
    color: "#0ff",
    fontSize: 15,
    fontWeight: "bold",
  },

  skillMp: {
    color: "#f90",
    fontSize: 13,
    fontWeight: "bold",
  },

  skillSubtitle: {
    color: "#8ab4ff",
    fontSize: 12,
    marginBottom: 8,
  },

  skillLearning: {
    color: "#0f0",
    fontSize: 11,
    marginBottom: 6,
    fontStyle: "italic",
  },

  skillDescription: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 18,
  },

  /* ================= MODAL ================= */

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
  },

  modalContainer: {
    backgroundColor: "#1e2a4a",
    padding: 16,
    borderRadius: 12,
  },

  modalTitle: {
    color: "#0ff",
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 18,
  },

  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
    color: "#000",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfInputLeft: {
    flex: 1,
    marginRight: 6,
  },

  halfInputRight: {
    flex: 1,
    marginLeft: 6,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  /* ================= TOP BUTTONS ================= */

  topLeftButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6,
  },

  topRightButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6,
  },

  topButtonText: {
    color: "#0ff",
    fontWeight: "bold",
  },
});