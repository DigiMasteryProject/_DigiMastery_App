const { logMensaje } = require("../utils/logger.js");
const partnerDigimonService = require("../services/partnerDigimonService.js");
const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const {Op} = require("sequelize")

const { user_campaign } = models;

class PartnerDigimonController {

  // =========================
  // GET ALL
  // =========================
  async getAllPartnerDigimons(req, res) {
    try {
      const filtros = req.query;
      const user = req.user;

      let datos;

      if (user.role === "ADMIN") {
        datos = await partnerDigimonService.getAllPartnerDigimons(filtros);
      }

      // DM → filtra por campañas del DM vía user_campaign
      else if (user.role === "DM") {
        const campaigns = await user_campaign.findAll({
          where: { id_user: user.id },
          attributes: ["id_campaign"]
        });

        const campaignIds = campaigns.map(c => c.id_campaign);

        datos = await partnerDigimonService.getAllPartnerDigimons({
          ...filtros,
          campaignIds
        });
      }

      // USER → solo sus digimon
      else {
        datos = await partnerDigimonService.getAllPartnerDigimons({
          ...filtros,
          id_user: user.id
        });
      }

      return res.status(200).json({
        ok: true,
        datos,
        mensaje: "Digimon recuperados correctamente",
      });

    } catch (err) {
      logMensaje("Error en getAllPartnerDigimons:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar digimon",
      });
    }
  }

  // =========================
  // GET BY ID
  // =========================
  async getPartnerDigimonById(req, res) {
  const id = parseInt(req.params.id);
  const user = req.user;

  try {
    const digimon = await partnerDigimonService.getPartnerDigimonById(id);

    if (!digimon) {
      return res.status(404).json({
        ok: false,
        mensaje: "Digimon no encontrado",
      });
    }

    // ADMIN → acceso total
    if (user.role === "ADMIN") {
      return res.status(200).json({
        ok: true,
        datos: digimon,
      });
    }

    // OWNER → acceso total
    if (digimon.id_user === user.id) {
      return res.status(200).json({
        ok: true,
        datos: digimon,
      });
    }

    // Campañas donde el usuario actual es DM
    const dmCampaigns = await user_campaign.findAll({
      where: {
        id_user: user.id,
        role: "DM"
      },
      attributes: ["id_campaign"]
    });

    const dmCampaignIds = dmCampaigns.map(c => c.id_campaign);

    // Verificar si el OWNER del digimon está en alguna campaña del DM
    const playerInDmCampaign = await user_campaign.findOne({
      where: {
        id_user: digimon.id_user,
        id_campaign: {
          [Op.in]: dmCampaignIds
        }
      }
    });

    // Si está en una campaña donde el usuario es DM → permitir acceso
    if (playerInDmCampaign) {
      return res.status(200).json({
        ok: true,
        datos: digimon,
      });
    }

    // Si no cumple ninguna condición → denegar
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permisos para ver este digimon",
    });

  } catch (err) {
    logMensaje("Error en getPartnerDigimonById:", err);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al recuperar el digimon",
    });
  }
}

  // =========================
  // CREATE
  // =========================
  async createPartnerDigimon(req, res) {
    const datos = req.body;
    const user = req.user;

    try {
      if (user.role === "USER") {
        datos.id_user = user.id;
      }

      const nuevo = await partnerDigimonService.createPartnerDigimon(datos);

      return res.status(201).json({
        ok: true,
        datos: nuevo,
      });

    } catch (err) {
      logMensaje("Error en createPartnerDigimon:", err);
      return res.status(400).json({
        ok: false,
        mensaje: err.message,
      });
    }
  }

  // =========================
  // UPDATE
  // =========================
  async updatePartnerDigimon(req, res) {
    const id = req.params.id;
    const datos = req.body;
    const user = req.user;

    try {
      const digimon = await partnerDigimonService.getPartnerDigimonById(id);

      if (!digimon) {
        return res.status(404).json({
          ok: false,
          mensaje: "Digimon no encontrado",
        });
      }

      if (user.role === "ADMIN") {
        const updated = await partnerDigimonService.updatePartnerDigimon(id, datos);
        return res.status(200).json({ ok: true, datos: updated });
      }

      if (user.role === "DM") {
        return res.status(403).json({
          ok: false,
          mensaje: "Un DM no puede editar digimon",
        });
      }

      if (user.role === "USER") {
        if (digimon.id_user !== user.id) {
          return res.status(403).json({
            ok: false,
            mensaje: "No puedes editar este digimon",
          });
        }

        const updated = await partnerDigimonService.updatePartnerDigimon(id, datos);
        return res.status(200).json({ ok: true, datos: updated });
      }

    } catch (err) {
      logMensaje("Error en updatePartnerDigimon:", err);
      return res.status(500).json({
        ok: false,
        mensaje: "Error al actualizar el digimon",
      });
    }
  }

  // =========================
  // DELETE
  // =========================
  async deletePartnerDigimon(req, res) {
    const id = req.params.id;
    const user = req.user;

    try {
      const digimon = await partnerDigimonService.getPartnerDigimonById(id);

      if (!digimon) {
        return res.status(404).json({
          ok: false,
          mensaje: "Digimon no encontrado",
        });
      }

      if (user.role === "ADMIN") {
        await partnerDigimonService.deletePartnerDigimon(id);
        return res.status(200).json({ ok: true });
      }

      if (user.role === "DM") {
        return res.status(403).json({
          ok: false,
          mensaje: "Un DM no puede eliminar digimon",
        });
      }

      if (user.role === "USER") {
        if (digimon.id_user !== user.id) {
          return res.status(403).json({
            ok: false,
            mensaje: "No puedes eliminar este digimon",
          });
        }

        await partnerDigimonService.deletePartnerDigimon(id);
        return res.status(200).json({ ok: true });
      }

    } catch (err) {
      logMensaje("Error en deletePartnerDigimon:", err);
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar el digimon",
      });
    }
  }

  async getDmAccessibleUserIds(dmUserId) {
  const campaigns = await user_campaign.findAll({
    where: { id_user: dmUserId },
    attributes: ["id_campaign"]
  });

  const campaignIds = campaigns.map(c => c.id_campaign);

  const users = await user_campaign.findAll({
    where: {
      id_campaign: { [Op.in]: campaignIds }
    },
    attributes: ["id_user"]
  });

  return [...new Set(users.map(u => u.id_user))];
}
}

/**
 * Helper: campañas del DM
 */
async function getDmCampaignIds(dmUserId) {
  const { user_campaign } = models;

  const rows = await user_campaign.findAll({
    where: { id_user: dmUserId },
    attributes: ["id_campaign"]
  });

  return rows.map(r => r.id_campaign);
}



module.exports = new PartnerDigimonController();