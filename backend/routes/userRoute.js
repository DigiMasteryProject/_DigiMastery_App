const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

// =========================
// PUBLIC ROUTES (SIN TOKEN)
// =========================

// Buscar por username (público básico)
router.get("/username", userController.getByUsername);

// Reset password (público)
router.post("/reset-password", userController.resetPasswordByEmail);

// =========================
// AUTH REQUIRED ROUTES
// =========================

// Obtener usuario por ID (lo usa campaigns / managePlayers / view players)
router.get("/:id", auth, userController.getUserById);

// =========================
// ADMIN ONLY ROUTES
// =========================

// Ver todos los usuarios (admin panel)
router.get("/", auth, requireAdmin, userController.getAllUsers);

// Crear usuario (normalmente admin o registro interno)
router.post("/", userController.createUser);

// Actualizar usuario (ban, edits, etc.)
router.put("/:id", auth, userController.updateUser);

// Borrar usuario (admin only)
router.delete("/:id", auth, requireAdmin, userController.deleteUser);

module.exports = router;