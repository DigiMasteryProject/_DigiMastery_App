const express = require("express");
const router = express.Router();
const npcController = require("../controllers/npcController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", npcController.getAllNpcs);
router.post("/", npcController.createNpc);
router.get("/:id", npcController.getNpcById);
router.put("/:id", npcController.updateNpc);
router.delete("/:id", npcController.deleteNpc);
router.get("/campaign/:campaignId", npcController.getNpcsByCampaign);

module.exports = router;
