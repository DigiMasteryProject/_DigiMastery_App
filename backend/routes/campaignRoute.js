const express = require("express");
const router = express.Router();

const campaignController = require("../controllers/campaignController");
const auth = require("../middleware/auth");
const campaignAccess = require("../middleware/campaignAccessMiddleware");

// 🔥 IMPORTANTE: orden correcto de middlewares
router.get(
  "/",
  auth,              // 1. primero auth
  campaignAccess,    // 2. luego acceso
  campaignController.getAll
);

router.post(
  "/",
  auth,
  campaignController.create
);

router.get(
  "/:id",
  auth,
  campaignAccess,
  campaignController.getById
);

router.put(
  "/:id",
  auth,
  campaignAccess,
  campaignController.updateCampaign
);

router.delete(
  "/:id",
  auth,
  campaignAccess,
  campaignController.deleteCampaign
);

module.exports = router;