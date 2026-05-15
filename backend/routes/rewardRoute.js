const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", rewardController.getAllRewards);
router.get("/:id", rewardController.getRewardById);

module.exports = router;
