const userCampaignService = require("../services/userCampaignService");

const campaignAccess = async (req, res, next) => {
  try {
    const campaignId =
      req.body?.id_campaign ||
      req.query?.id_campaign ||
      req.params?.id;

    if (!campaignId) return next();

    if (req.user?.role?.toUpperCase() === "ADMIN") return next();

    const access = await userCampaignService.getAll({
      id_campaign: campaignId,
      id_user: req.user.id,
    });

    if (!access.length) {
      return res.status(403).json({
        ok: false,
        mensaje: "No tienes acceso a esta campaña",
      });
    }

    req.userCampaign = access[0];
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, mensaje: "Error interno" });
  }
};

module.exports = campaignAccess;
