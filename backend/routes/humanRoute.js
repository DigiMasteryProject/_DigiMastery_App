const express = require("express");
const router = express.Router();
const humanController = require("../controllers/humanController.js");
const auth = require("../middleware/auth.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", auth, humanController.getAllHumans);

router.get("/:id", auth, humanController.getHumanById);

router.post("/", auth, humanController.createHuman);

router.put("/:id", auth, humanController.updateHuman);

router.delete("/:id", auth, humanController.deleteHuman);

module.exports = router;
