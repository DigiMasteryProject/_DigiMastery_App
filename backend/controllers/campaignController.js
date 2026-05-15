const { logMensaje } = require("../utils/logger.js");
const campaignService = require("../services/campaignService.js");
const userCampaignService = require("../services/userCampaignService.js");

class CampaignController {

  // 🔥 CREATE CAMPAIGN + ASIGNAR DM
  async create(req, res) {
    try {
      const { id_user, ...campaignData } = req.body;

      if (!id_user) {
        return res.status(400).json({
          ok: false,
          mensaje: "Falta id_user (creador)",
        });
      }

      // 1. crear campaña
      const campaign = await campaignService.createCampaign(campaignData);

      if (!campaign || !campaign.id) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error creando campaña",
        });
      }

      // 2. asignar DM automáticamente
      await userCampaignService.createUserCampaign({
        id_user,
        id_campaign: campaign.id,
        role: "DM",
      });

      return res.status(201).json({
        ok: true,
        datos: campaign,
        mensaje: "Campaña creada correctamente",
      });

    } catch (err) {
      logMensaje("Error create campaign:", err);
      return res.status(500).json({
        ok: false,
        mensaje: "Error interno",
      });
    }
  }

  // 🔥 GET ALL CAMPAIGNS
  async getAll(req, res) {
    try {
      const data = await campaignService.getAllCampaigns();

      return res.json({
        ok: true,
        datos: data,
      });

    } catch (err) {
      logMensaje("Error getAll campaign:", err);
      return res.status(500).json({
        ok: false,
        mensaje: "Error interno",
      });
    }
  }

  // 🔥 GET BY ID (ESTE TE FALTABA)
  async getById(req, res) {
    try {
      const id = req.params.id;

      const campaign = await campaignService.getCampaignById(id);

      if (!campaign) {
        return res.status(404).json({
          ok: false,
          mensaje: "Campaña no encontrada",
        });
      }

      return res.json({
        ok: true,
        datos: campaign,
      });

    } catch (err) {
      logMensaje("Error getById campaign:", err);
      return res.status(500).json({
        ok: false,
        mensaje: "Error interno",
      });
    }
  }

  // 🔥 UPDATE CAMPAIGN
  async updateCampaign(req, res) {
    try {
      const actualizado = await campaignService.updateCampaign(
        req.params.id,
        req.body
      );

      if (!actualizado) {
        return res.status(404).json({
          ok: false,
          mensaje: "Campaña no encontrada",
        });
      }

      return res.json({
        ok: true,
        datos: actualizado,
      });

    } catch (err) {
      logMensaje("Error en updateCampaign:", err);
      return res.status(400).json({
        ok: false,
        mensaje: err.message,
      });
    }
  }

  // 🔥 DELETE CAMPAIGN
  async deleteCampaign(req, res) {
    try {
      const eliminado = await campaignService.deleteCampaign(req.params.id);

      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          mensaje: "Campaña no encontrada",
        });
      }

      return res.json({
        ok: true,
        mensaje: "Campaña eliminada",
      });

    } catch (err) {
      logMensaje("Error en deleteCampaign:", err);
      return res.status(500).json({
        ok: false,
        mensaje: "Error del servidor",
      });
    }
  }
}

module.exports = new CampaignController();