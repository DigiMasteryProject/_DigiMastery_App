const express = require("express");
const router = express.Router();
const digimonController = require("../controllers/digimonController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", digimonController.getAllDigimon);
router.get("/:id", digimonController.getDigimonById);

module.exports = router;
