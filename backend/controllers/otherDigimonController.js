const { logMensaje } = require("../utils/logger.js");
const otherDigimonService = require("../services/otherDigimonService.js");

class OtherDigimonController {
  async getAllOtherDigimons(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      const usuarios = Object.keys(filtros).length ? await otherDigimonService.getAllOtherDigimons(filtros) : await otherDigimonService.getAllOtherDigimons();
      return res.status(200).json({
        ok: true,
        datos: usuarios,
        mensaje: "Digimon recuperados correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllOtherDigimons:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar digimon",
      });
    }
  }

  async getOtherDigimonById(req, res) {
    const id = req.params.id;
    try {
      const u = await otherDigimonService.getOtherDigimonById(id);
      if (!u) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Digimon no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: u,
        mensaje: "Digimon recuperado correctamente",
      });
    } catch (err) {
      logMensaje("Error en getOtherDigimonById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar el digimon",
      });
    }
  }

  async createOtherDigimon(req, res) {
    const datos = req.body;
    try {
      const nuevo = await otherDigimonService.createOtherDigimon(datos);
      return res.status(201).json({
        ok: true,
        datos: nuevo,
        mensaje: "Digimon creado correctamente",
      });
    } catch (err) {
      logMensaje("Error en createOtherDigimon:", err);
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al crear el digimon: " + err.message,
      });
    }
  }

  async updateOtherDigimon(req, res) {
    const id = req.params.id;
    const datos = req.body;
    try {
      const actualizado = await otherDigimonService.updateOtherDigimon(id, datos);
      if (!actualizado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Digimon no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: actualizado,
        mensaje: "Digimon actualizado correctamente",
      });
    } catch (err) {
      logMensaje("Error en updateOtherDigimon:", err);
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al actualizar el digimon: " + err.message,
      });
    }
  }

  async deleteOtherDigimon(req, res) {
    const id = req.params.id;
    try {
      const eliminado = await otherDigimonService.deleteOtherDigimon(id);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Digimon no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: null,
        mensaje: "Digimon eliminado correctamente",
      });
    } catch (err) {
      logMensaje("Error en deleteOtherDigimon:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al eliminar el digimon",
      });
    }
  }
}

module.exports = new OtherDigimonController();
