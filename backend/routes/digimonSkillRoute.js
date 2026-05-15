const express = require("express");
const router = express.Router();
const digimonSkillController = require("../controllers/digimonSkillController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", digimonSkillController.getAllDigimonSkills);
router.get("/:id", digimonSkillController.getDigimonSkillByIdDigimon);
router.get("/skill/:id", digimonSkillController.getDigimonSkillsByIdSkill);

module.exports = router;
