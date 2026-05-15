const sequelize = require("../config/sequelize");
const models = require("../models/init-models")(sequelize);
const { user_campaign } = models;

const campaignRoleAccess = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const campaignId =
        req.params.id_campaign ||
        req.query.id_campaign ||
        req.body.id_campaign;

      // 🔥 SI NO HAY CAMPAIGN → NO BLOQUEAR AQUÍ
      // (esto es clave para /user_campaign GET ALL)
      if (!campaignId) {
        return next();
      }

      // ADMIN bypass total
      if (userRole === "ADMIN") return next();

      const relation = await user_campaign.findOne({
        where: {
          id_user: userId,
          id_campaign: campaignId,
        },
      });

      if (!relation) {
        return res.status(403).json({
          ok: false,
          mensaje: "No perteneces a esta campaña",
        });
      }

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(relation.role)
      ) {
        return res.status(403).json({
          ok: false,
          mensaje: "Sin permisos",
        });
      }

      req.campaignRole = relation.role;
      next();
    } catch (err) {
      console.log("campaignRoleAccess error:", err);
      return res.status(500).json({ ok: false });
    }
  };
};

module.exports = campaignRoleAccess;