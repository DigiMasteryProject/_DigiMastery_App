const { logMensaje } = require("../utils/logger.js");
const humanService = require("../services/humanService.js");
const userCampaignService = require("../services/userCampaignService");

class HumanController {

  async getAllHumans(req, res) {
    try {
      const filtros = req.query;

      const humanos = Object.keys(filtros).length
        ? await humanService.getAllHumans(filtros)
        : await humanService.getAllHumans();

      return res.status(200).json({
        ok: true,
        datos: humanos,
        mensaje: "Humanos recuperados correctamente",
      });

    } catch (err) {
      logMensaje("Error en getAllHumans:", err);

      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar humanos",
      });
    }
  }

  async getHumanById(req, res) {
    const id = req.params.id;

    try {
      const human = await humanService.getHumanById(id);

      if (!human) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Humano no encontrado",
        });
      }

      const isAdmin = req.user.role === "ADMIN";

      // 🔥 OWNER
      const isOwner =
        human.id_user &&
        Number(human.id_user) === Number(req.user.id);

      // 🔥 NPC PREDEFINIDO (id_user null)
      let isDM = false;

      if (human.id_user === null) {

        const relations = await userCampaignService.getAll({
          id_user: req.user.id,
        });

        isDM = relations.some((r) => r.role === "DM");
      }

      // 🔥 VIEW PLAYERS:
      // DM puede ver humanos de jugadores de SU campaña
      let sharedCampaignDM = false;

      if (human.id_user !== null) {

        const myCampaigns = await userCampaignService.getAll({
          id_user: req.user.id,
        });

        const targetCampaigns = await userCampaignService.getAll({
          id_user: human.id_user,
        });

        sharedCampaignDM = myCampaigns.some(
          (mine) =>
            mine.role === "DM" &&
            targetCampaigns.some(
              (target) =>
                Number(target.id_campaign) === Number(mine.id_campaign)
            )
        );
      }

      if (!isAdmin && !isOwner && !isDM && !sharedCampaignDM) {
        return res.status(403).json({
          ok: false,
          mensaje: "No autorizado",
        });
      }

      return res.status(200).json({
        ok: true,
        datos: human,
        mensaje: "Humano recuperado correctamente",
      });

    } catch (err) {
      logMensaje("Error en getHumanById:", err);

      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar el humano",
      });
    }
  }

  async createHuman(req, res) {
    try {

      const datos = {
        ...req.body,
      };

      // 🔥 solo admin puede crear fichas con id_user null
      if (
        datos.id_user === null &&
        req.user.role !== "ADMIN"
      ) {
        return res.status(403).json({
          ok: false,
          mensaje: "No autorizado",
        });
      }

      // 🔥 usuarios normales siempre crean sus propias fichas
      if (req.user.role !== "ADMIN") {
        datos.id_user = req.user.id;
      }

      const nuevo = await humanService.createHuman(datos);

      return res.status(201).json({
        ok: true,
        datos: nuevo,
        mensaje: "Humano creado correctamente",
      });

    } catch (err) {
      logMensaje("Error en createHuman:", err);

      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al crear el humano: " + err.message,
      });
    }
  }

  async updateHuman(req, res) {
    const id = req.params.id;

    try {
      const human = await humanService.getHumanById(id);

      if (!human) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Humano no encontrado",
        });
      }

      const isAdmin = req.user.role === "ADMIN";

      const isOwner =
        human.id_user &&
        Number(human.id_user) === Number(req.user.id);

      let sharedCampaignDM = false;

if (human.id_user !== null) {

  const myCampaigns = await userCampaignService.getAll({
    id_user: req.user.id,
  });

  const targetCampaigns = await userCampaignService.getAll({
    id_user: human.id_user,
  });

  sharedCampaignDM = myCampaigns.some(
    (mine) =>
      mine.role === "DM" &&
      targetCampaigns.some(
        (target) =>
          Number(target.id_campaign) === Number(mine.id_campaign)
      )
  );
}

      // 🔥 NPCs predefinidos SOLO admin
      if (human.id_user === null && !isAdmin) {
        return res.status(403).json({
          ok: false,
          mensaje: "Solo admin puede modificar NPCs predefinidos",
        });
      }

      if (!isAdmin && !isOwner && !sharedCampaignDM) {
        return res.status(403).json({
          ok: false,
          mensaje: "No autorizado",
        });
      }

      // 🔥 evitar que usuarios cambien ownership
      const datos = { ...req.body };

      if (!isAdmin) {
        datos.id_user = human.id_user;
      }

      const actualizado = await humanService.updateHuman(id, datos);

      return res.status(200).json({
        ok: true,
        datos: actualizado,
        mensaje: "Humano actualizado correctamente",
      });

    } catch (err) {
      logMensaje("Error en updateHuman:", err);

      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al actualizar el humano: " + err.message,
      });
    }
  }

  async deleteHuman(req, res) {
    const id = req.params.id;

    try {
      const human = await humanService.getHumanById(id);

      if (!human) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Humano no encontrado",
        });
      }

      const isAdmin = req.user.role === "ADMIN";

      const isOwner =
        human.id_user &&
        Number(human.id_user) === Number(req.user.id);

      // 🔥 NPCs predefinidos SOLO admin
      if (human.id_user === null && !isAdmin) {
        return res.status(403).json({
          ok: false,
          mensaje: "Solo admin puede eliminar NPCs predefinidos",
        });
      }

      if (!isAdmin && !isOwner) {
        return res.status(403).json({
          ok: false,
          mensaje: "No autorizado",
        });
      }

      const eliminado = await humanService.deleteHuman(id);

      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Humano no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        datos: null,
        mensaje: "Humano eliminado correctamente",
      });

    } catch (err) {
      logMensaje("Error en deleteHuman:", err);

      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al eliminar el humano",
      });
    }
  }
}

module.exports = new HumanController();