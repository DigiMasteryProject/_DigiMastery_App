// routes/auth.js

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const router = express.Router();

const userService = require("../services/userService");

// ✅ Rate limit anti fuerza bruta
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    ok: false,
    mensaje: "Too many login attempts. Try again later.",
  },
});

// ✅ LOGIN
router.post(
  "/login",

  // ✅ Rate limit
  loginLimiter,

  // ✅ Validación básica inputs
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Invalid username"),

    body("password")
      .isLength({ min: 4, max: 100 })
      .withMessage("Invalid password"),
  ],

  async (req, res) => {
    // ✅ Comprobar errores validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        mensaje: "Invalid fields",
        errores: errors.array(),
      });
    }

    const { username, password } = req.body;

    try {
      // ✅ Buscar usuario
      const user = await userService.getByUsername(username);

      // ✅ No revelar si existe o no
      if (!user) {
        return res.status(400).json({
          ok: false,
          mensaje: "Invalid credentials",
        });
      }

      // ✅ Verificar password
      const validPassword = await bcrypt.compare(
        password,
        user.password
      );

      if (!validPassword) {
        return res.status(400).json({
          ok: false,
          mensaje: "Invalid credentials",
        });
      }

      // ✅ Usuario baneado
      if (user.banned) {
        return res.status(403).json({
          ok: false,
          mensaje: "User banned",
        });
      }

      // ✅ Actualizar último login
      await user.update({
        last_login: new Date(),
      });

      // ✅ Generar token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          banned: user.banned,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h",
        }
      );

      // ✅ Respuesta
      return res.status(200).json({
        ok: true,
        mensaje: "Login successful",

        token,

        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          banned: user.banned,
        },
      });

    } catch (err) {
      console.error("Login error:", err);

      return res.status(500).json({
        ok: false,
        mensaje: "Server error",
      });
    }
  }
);

module.exports = router;
