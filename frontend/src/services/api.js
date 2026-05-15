import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const api = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "https://backend-production-8080.up.railway.app",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;

      if (Platform.OS === "web") {
        token = localStorage.getItem("token");
      } else {
        token = await SecureStore.getItemAsync("token");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (err) {
      console.log("Request interceptor error:", err);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
  (response) => {
    return response.data;
  },

  async (error) => {

    let respuestaError = {
      ok: false,
      datos: null,
      mensaje: "Error desconocido",
    };

    /* =========================
       🚫 USER BANNED / FORBIDDEN
    ========================= */

    if (error.response?.status === 403) {

      respuestaError.mensaje = error.response.data?.mensaje || "Access denied";

      return Promise.reject(respuestaError);
    }

    if (error.response?.status === 401) {

  try {

    if (Platform.OS === "web") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      window.location.href = "/login";
    } else {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");
    }

  } catch (e) {
    console.log("Logout interceptor error:", e);
  }

  respuestaError.mensaje = "Sesión expirada";
  return Promise.reject(respuestaError);
}

    /* =========================
       NORMAL ERROR HANDLING
    ========================= */

    if (error.response) {

      respuestaError.mensaje =
        error.response.data?.mensaje ||
        `Error: ${error.response.status} ${error.response.statusText}`;

      if (error.response.status === 404) {
        console.warn(`Recurso no encontrado (404): ${error.config.url}`);
      } else if (error.response.status === 400) {
        console.warn(`Solicitud inválida (400): ${error.config.url}`);
      } else if (error.response.status >= 500) {
        console.error(
          `Error del servidor (${error.response.status}): ${error.config.url}`
        );
      }

    } else if (error.request) {

      respuestaError.mensaje =
        "No hay respuesta del servidor. Verifica tu conexión.";

      console.error("No hay respuesta del servidor:", error.request);

    } else {

      respuestaError.mensaje =
        error.message || "Error al realizar la solicitud";

      console.error(
        "Error en la preparación de la solicitud:",
        error.message
      );
    }

    return Promise.reject(respuestaError);
  }
);

export default api;
