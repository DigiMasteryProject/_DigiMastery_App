const userCampaignService = require("../services/userCampaignService.js");
const { logMensaje } = require("../utils/logger.js");

class UserCampaignController {

 async getAll(req, res) {
  try {
    const { campaign, user } = req.query;

    const userRole = req.user?.role;
    const userId = req.user?.id;

    let filters = {};

    if (campaign) {
      filters.id_campaign = campaign;
    }

    if (user) {
      filters.id_user = user;
    }

    // 🔥 IMPORTANTE: SOLO filtrar por usuario si NO hay campaign ni filtro explícito
    if (!campaign && !user) {
      if (userRole !== "ADMIN") {
        filters.id_user = userId;
      }
    }

    const data = await userCampaignService.getAll(filters);

    return res.json({
      ok: true,
      datos: data,
    });

  } catch (err) {
    console.log("getAll error:", err);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno",
    });
  }
}
  async getUserCampaignById(req, res) {
    try {
      const id = req.params.id;

      const data = await userCampaignService.getUserCampaignById(id);

      if (!data) {
        return res.status(404).json({
          ok: false,
          mensaje: "No encontrado",
        });
      }

      return res.json({
        ok: true,
        datos: data,
      });

    } catch (err) {
      logMensaje(err);
      return res.status(500).json({ ok: false });
    }
  }

  async createUserCampaign(req, res) {
  try {
    const datos = req.body;

    // 🔥 ADMIN → acceso total
    const isAdmin = req.user.role === "ADMIN";

    // 🔥 Si NO es admin, comprobar DM
    if (!isAdmin) {

      const relations = await userCampaignService.getAll({
        id_user: req.user.id,
        id_campaign: datos.id_campaign
      });

      const isDMRole = relations.find(
        (r) => r.role === "DM"
      );

      if (!isDMRole) {
        return res.status(403).json({
          ok: false,
          mensaje: "Solo el DM puede modificar la campaña"
        });
      }
    }

    const created =
      await userCampaignService.createUserCampaign(datos);

    return res.status(201).json({
      ok: true,
      datos: created
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      mensaje: "Error interno"
    });
  }
}
  async updateUserCampaign(req, res) {
  try {
    const id = req.params.id;
    const datos = req.body;

    const uc = await userCampaignService.getUserCampaignById(id);

    if (!uc) {
      return res.status(404).json({
        ok: false,
        mensaje: "No encontrado",
      });
    }

    const isAdmin = req.user.role === "ADMIN";

    const isOwner = Number(uc.id_user) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        ok: false,
        mensaje: "Sin permisos",
      });
    }

    const updated =
      await userCampaignService.updateUserCampaign(id, datos);

    return res.json({
      ok: true,
      datos: updated,
    });

  } catch (err) {
    return res.status(400).json({
      ok: false,
      mensaje: err.message,
    });
  }
}

  async deleteUserCampaign(req, res) {
  try {
    const id = req.params.id;

    const uc = await userCampaignService.getUserCampaignById(id);

    if (!uc) {
      return res.status(404).json({ ok: false });
    }

    const isAdmin = req.user.role === "ADMIN";

    const isDM = await userCampaignService.getAll({
      id_user: req.user.id,
      id_campaign: uc.id_campaign
    });

    const isDMRole = isDM.find((r) => r.role === "DM");

    if (!isAdmin && !isDMRole) {
      return res.status(403).json({
        ok: false,
        mensaje: "No tienes permisos"
      });
    }

    await userCampaignService.deleteUserCampaign(id);

    return res.json({ ok: true });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false });
  }
}
}

module.exports = new UserCampaignController();