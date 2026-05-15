const express = require("express");
const router = express.Router();
const otherDigimonController = require("../controllers/otherDigimonController.js");
const otherDigimonAccess = require("../middleware/otherDigimonAccess.js");
const auth = require("../middleware/auth.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", otherDigimonController.getAllOtherDigimons);
router.post("/", otherDigimonController.createOtherDigimon);
router.get("/:id", otherDigimonController.getOtherDigimonById);
router.put("/:id", auth, otherDigimonAccess, otherDigimonController.updateOtherDigimon);
router.delete("/:id", auth, otherDigimonAccess, otherDigimonController.deleteOtherDigimon);

module.exports = router;
