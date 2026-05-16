const userCampaignService = require("../services/userCampaignService");

const campaignAccess = async (req, res, next) => {
  try {

    let campaignId = null;

    if (req.body?.id_campaign) {
      campaignId = req.body.id_campaign;
    }

    else if (req.query?.id_campaign) {
      campaignId = req.query.id_campaign;
    }

    else if (req.query?.campaign) {
      campaignId = req.query.campaign;
    }

    else if (req.params?.id_campaign) {
      campaignId = req.params.id_campaign;
    }

    else if (req.query?.uc_id) {

      const uc =
        await userCampaignService.getUserCampaignById(
          req.query.uc_id
        );

      if (uc) {
        campaignId = uc.id_campaign;
      }
    }

    else if (req.params?.id) {

      const uc =
        await userCampaignService.getUserCampaignById(
          req.params.id
        );

      if (uc) {
        campaignId = uc.id_campaign;
      }
    }

    if (!campaignId) {
      return next();
    }

    // ✅ ADMIN bypass
    if (
      req.user?.role &&
      String(req.user.role).toUpperCase() === "ADMIN"
    ) {
      return next();
    }

    const access = await userCampaignService.getAll({
      id_campaign: campaignId,
      id_user: req.user.id,
    });

    if (!access || access.length === 0) {
      return res.status(403).json({
        ok: false,
        mensaje: "No tienes acceso a esta campaña",
      });
    }

    // ✅ MUY IMPORTANTE
    req.userCampaign = access[0];

    next();

  } catch (err) {

    console.log("campaignAccess error:", err);

    return res.status(500).json({
      ok: false,
      mensaje: "Error interno",
    });
  }
};

module.exports = campaignAccess;
