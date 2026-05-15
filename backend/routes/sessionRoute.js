const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", sessionController.getAllSessions);
router.post("/", sessionController.createSession);
router.get("/campaign/:id", sessionController.getSessionByCampaign);
router.get("/:id", sessionController.getSessionById);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);


module.exports = router;
