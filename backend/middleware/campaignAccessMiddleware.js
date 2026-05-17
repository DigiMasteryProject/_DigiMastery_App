const userCampaignService = require("../services/userCampaignService");

const campaignAccess = async (req, res, next) => {
  try {
    const campaignId =
      req.body?.id_campaign ||
      req.query?.id_campaign ||
      req.params?.id_campaign ||
      req.params?.id ||
      req.query?.campaign;

    if (!campaignId) return next();

    if (req.user?.role?.toUpperCase() === "ADMIN") return next();

    const access = await userCampaignService.getAll({
      id_campaign: Number(campaignId),
      id_user: Number(req.user.id),
    });

    if (!access || access.length === 0) {
      return res.status(403).json({
        ok: false,
        mensaje: "No tienes acceso a esta campaña",
      });
    }

    req.userCampaign = access[0];
    next();
  } catch (err) {
    console.log("campaignAccess error:", err);
    return res.status(500).json({ ok: false, mensaje: "Error interno" });
  }
};

module.exports = campaignAccess;
