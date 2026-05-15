const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", skillController.getAllSkills);
router.get("/:id", skillController.getSkillById);
router.get("/element/:element", skillController.getSkillsByElement);
module.exports = router;
