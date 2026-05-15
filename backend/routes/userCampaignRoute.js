const express = require("express");
const router = express.Router();

const userCampaignController = require("../controllers/userCampaignController");

const auth = require("../middleware/auth");
const campaignAccess = require("../middleware/campaignAccessMiddleware");

// GET ALL → SOLO auth
router.get("/", auth, userCampaignController.getAll);
router.get("/:id", auth, campaignAccess, userCampaignController.getUserCampaignById);
// CREATE → auth + campaignAccess
router.post("/", auth, campaignAccess, userCampaignController.createUserCampaign);
router.put("/:id", auth, campaignAccess, userCampaignController.updateUserCampaign);

// DELETE → auth + campaignAccess
router.delete("/:id", auth, campaignAccess, userCampaignController.deleteUserCampaign);

module.exports = router;