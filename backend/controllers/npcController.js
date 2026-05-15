const { logMensaje } = require("../utils/logger.js");
const npcService = require("../services/npcService.js");

class NpcController {
  async getAllNpcs(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      if (req.query.id_campaign) filtros.id_campaign = req.query.id_campaign;
      const npcs = Object.keys(filtros).length ? await npcService.getAllNpcs(filtros) : await npcService.getAllNpcs();
      return res.status(200).json({
        ok: true,
        datos: npcs,
        mensaje: "Npcs recuperados correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllNpcs:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar npcs",
      });
    }
  }

  async getNpcById(req, res) {
    const id = req.params.id;
    try {
      const u = await npcService.getNpcById(id);
      if (!u) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Npc no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: u,
        mensaje: "Npc recuperado correctamente",
      });
    } catch (err) {
      logMensaje("Error en getNpcById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar el npc",
      });
    }
  }

  async getNpcsByCampaign(req, res) {
  const campaignId = req.params.campaignId;
  const { type } = req.query;

  try {
    const npcs = await npcService.getNpcByCampaign(campaignId, type);

    return res.status(200).json({
      ok: true,
      datos: npcs,
      mensaje: "Npcs de la campaña recuperados correctamente",
    });
  } catch (err) {
    logMensaje("Error en getNpcsByCampaign:", err);
    return res.status(500).json({
      ok: false,
      datos: null,
      mensaje: "Error al recuperar los npcs de la campaña",
    });
  }
}

  async createNpc(req, res) {
    const datos = req.body;
    try {
      const nuevo = await npcService.createNpc(datos);
      return res.status(201).json({
        ok: true,
        datos: nuevo,
        mensaje: "Npc creado correctamente",
      });
    } catch (err) {
      logMensaje("Error en createNpc:", err);
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al crear el npc: " + err.message,
      });
    }
  }

  async updateNpc(req, res) {
    const id = req.params.id;
    const datos = req.body;
    try {
      const actualizado = await npcService.updateNpc(id, datos);
      if (!actualizado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Npc no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: actualizado,
        mensaje: "Npc actualizado correctamente",
      });
    } catch (err) {
      logMensaje("Error en updateNpc:", err);
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al actualizar el npc: " + err.message,
      });
    }
  }

  async deleteNpc(req, res) {
    const id = req.params.id;
    try {
      const eliminado = await npcService.deleteNpc(id);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Npc no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: null,
        mensaje: "Npc eliminado correctamente",
      });
    } catch (err) {
      logMensaje("Error en deleteNpc:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al eliminar el npc",
      });
    }
  }
}

module.exports = new NpcController();
