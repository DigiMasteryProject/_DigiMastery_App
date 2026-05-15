const express = require("express");
const router = express.Router();
const familyController = require("../controllers/familyController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", familyController.getAllFamilies);
router.get("/:id", familyController.getFamilyById);
module.exports = router;
