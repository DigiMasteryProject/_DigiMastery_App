const express = require("express");
const router = express.Router();
const digimonEvolutionController = require("../controllers/digimonEvolutionController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", digimonEvolutionController.getAllDigimonEvolution);
router.get("/base/:id", digimonEvolutionController.getDigimonEvolutionByBaseDigimonId);
router.get("/new/:newDigimonId", digimonEvolutionController.getDigimonEvolutionByNewDigimonId);
router.get("/:id", digimonEvolutionController.getDigimonEvolutionById);
module.exports = router;
