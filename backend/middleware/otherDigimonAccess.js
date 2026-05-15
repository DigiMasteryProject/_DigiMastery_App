const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models").initModels;

const models = initModels(sequelize);

const {
  other_digimon,
  npc,
  user_campaign,
} = models;

const otherDigimonAccess = async (req, res, next) => {
  try {

    // =========================
    // ADMIN SIEMPRE PUEDE
    // =========================

    if (req.user.role === "ADMIN") {
      return next();
    }

    const otherDigimonId = req.params.id;

    // =========================
    // BUSCAR OTHER DIGIMON
    // =========================

    const otherDigimon = await other_digimon.findByPk(otherDigimonId);

    if (!otherDigimon) {
      return res.status(404).json({
        ok: false,
        mensaje: "Digimon no encontrado",
      });
    }

    // =========================
    // BUSCAR NPC RELACIONADO
    // =========================

    const npcDigimon = await npc.findOne({
      where: {
        id_digimon: otherDigimon.id,
        type: "digimon",
      },
    });

    if (!npcDigimon) {
      return res.status(403).json({
        ok: false,
        mensaje: "Este Digimon no pertenece a un NPC",
      });
    }

    // =========================
    // COMPROBAR SI ES DM
    // =========================

    const campaignAccess = await user_campaign.findOne({
      where: {
        id_user: req.user.id,
        id_campaign: npcDigimon.id_campaign,
        role: "DM",
      },
    });

    if (!campaignAccess) {
      return res.status(403).json({
        ok: false,
        mensaje: "No tienes permisos para editar este Digimon",
      });
    }

    next();

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      mensaje: "Error comprobando permisos",
    });
  }
};

module.exports = otherDigimonAccess;