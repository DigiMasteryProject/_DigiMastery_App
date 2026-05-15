const express = require("express");
const router = express.Router();
const codeShardController = require("../controllers/codeShardController.js");

// Todas las rutas apuntan directamente a las funciones
router.get("/", codeShardController.getAllCodeShards);
router.post("/", codeShardController.createCodeShard);
router.get("/:id", codeShardController.getCodeShardById);
router.put("/:id", codeShardController.updateCodeShard);
router.delete("/:id", codeShardController.deleteCodeShard);
router.get("/user/:userId", codeShardController.getCodeShardsByUserId);

module.exports = router;
