const { logMensaje } = require("../utils/logger.js");
const sessionService = require("../services/sessionService.js");

class SessionController {
  async getAllSessions(req, res) {
  try {
    const sesiones = await sessionService.getAllSessions();

    return res.status(200).json({
      ok: true,
      datos: sesiones,
      mensaje: "Sesiones recuperadas correctamente",
    });

  } catch (err) {
    logMensaje("Error en getAllSessions:", err);

    return res.status(500).json({
      ok: false,
      datos: null,
      mensaje: "Error al recuperar sesiones",
    });
  }
}

  async getSessionById(req, res) {
    const id = req.params.id;
    try {
      const u = await sessionService.getSessionById(id);
      if (!u) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Sesión no encontrada",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: u,
        mensaje: "Sesión recuperada correctamente",
      });
    } catch (err) {
      logMensaje("Error en getSessionById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar la sesión",
      });
    }
  }

  async getSessionByCampaign(req, res) {
  const id = req.params.id;

  try {
    const sesiones = await sessionService.getSessionByCampaign(id);

    return res.status(200).json({
      ok: true,
      datos: sesiones,
      mensaje: "Sesiones recuperadas correctamente",
    });

  } catch (err) {
    logMensaje("Error en getSessionByCampaign:", err);

    return res.status(500).json({
      ok: false,
      datos: null,
      mensaje: "Error al recuperar sesiones",
    });
  }
}

  async createSession(req, res) {
    const datos = req.body;
    try {
      const nuevo = await sessionService.createSession(datos);
      return res.status(201).json({
        ok: true,
        datos: nuevo,
        mensaje: "Sesión creada correctamente",
      });
    } catch (err) {
      logMensaje("Error en createSession:", err);
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al crear la sesión: " + err.message,
      });
    }
  }

  async updateSession(req, res) {
    const id = req.params.id;
    const datos = req.body;
    try {
      const actualizado = await sessionService.updateSession(id, datos);
      if (!actualizado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Sesión no encontrada",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: actualizado,
        mensaje: "Sesión actualizada correctamente",
      });
    } catch (err) {
      logMensaje("Error en updateSession:", err);
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al actualizar la sesión: " + err.message,
      });
    }
  }

  async deleteSession(req, res) {
    const id = req.params.id;
    try {
      const eliminado = await sessionService.deleteSession(id);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Sesión no encontrada",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: null,
        mensaje: "Sesión eliminada correctamente",
      });
    } catch (err) {
      logMensaje("Error en deleteSession:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al eliminar la sesión",
      });
    }
  }
}

module.exports = new SessionController();
