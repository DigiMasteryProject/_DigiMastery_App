const { logMensaje } = require("../utils/logger.js");
const userService = require("../services/userService.js");
const userCampaignService = require("../services/userCampaignService");

class UserController {

  // =========================
  // GET ALL USERS (ADMIN / BACKOFFICE)
  // =========================
  async getAllUsers(req, res) {
    try {
      const filtros = {};

      if (req.query.username) filtros.username = req.query.username;
      if (req.query.role) filtros.role = req.query.role;
      if (req.query.banned) filtros.banned = req.query.banned;

      const usuarios =
        Object.keys(filtros).length
          ? await userService.getAllUsers(filtros)
          : await userService.getAllUsers();

      return res.status(200).json({
        ok: true,
        datos: usuarios,
        mensaje: "Usuarios recuperados correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllUsers:", err);

      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar usuarios",
      });
    }
  }

  // =========================
  // GET USER BY ID (VIEW PROFILE LOGIC)
  // =========================
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);

      if (!user) {
        return res.status(404).json({
          ok: false,
          mensaje: "Usuario no encontrado",
        });
      }

      // 🔥 ADMIN → acceso total
      if (req.user.role === "ADMIN") {
        return res.json({ ok: true, datos: user });
      }

      // 🔥 propio usuario
      if (req.user.id === user.id) {
        return res.json({ ok: true, datos: user });
      }

      // 🔥 acceso por campaña (solo para view players)
      const myCampaigns = await userCampaignService.getAll({
        id_user: req.user.id,
      });

      const targetCampaigns = await userCampaignService.getAll({
        id_user: user.id,
      });

      const sharedCampaign = myCampaigns.some((mine) =>
        targetCampaigns.some(
          (target) => target.id_campaign === mine.id_campaign
        )
      );

      if (!sharedCampaign) {
        return res.status(403).json({
          ok: false,
          mensaje: "No autorizado",
        });
      }

      return res.json({ ok: true, datos: user });

    } catch (err) {
      console.log("getUserById error:", err);

      return res.status(500).json({
        ok: false,
        mensaje: "Error interno",
      });
    }
  }

  // =========================
  // 🔵 GLOBAL USER SEARCH (DM SAFE - NO CAMPAIGN LOGIC)
  // =========================
  async getByUsername(req, res) {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Falta el parámetro username",
      });
    }

    try {
      const user = await userService.getByUsername(username);

      if (!user) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        datos: user,
        mensaje: "Usuario recuperado correctamente",
      });

    } catch (err) {
      logMensaje("Error en getByUsername:", err);

      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar el usuario",
      });
    }
  }

  // =========================
  // CREATE USER (ADMIN ONLY)
  // =========================
  async createUser(req, res) {
  try {

    const datos = req.body;

    const safeUser = {
      username: datos.username,
      email: datos.email,
      password: datos.password,
      role: "USER", // 🔥 FORZADO
    };

    const nuevo =
      await userService.createUser(safeUser);

    return res.status(201).json({
      ok: true,
      datos: nuevo,
    });

  } catch (err) {
    return res.status(400).json({
      ok: false,
      mensaje: err.message,
    });
  }
}

  // =========================
  // UPDATE USER (ADMIN ONLY)
  // =========================
  async updateUser(req, res) {

  const id = parseInt(req.params.id);
  const datos = req.body;
  const authUser = req.user;

  try {

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        datos: null,
        mensaje: "Usuario no encontrado",
      });
    }

    // =====================================
    // PERMISOS
    // =====================================

    const isAdmin = authUser.role === "ADMIN";
    const isOwner = authUser.id === id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        ok: false,
        mensaje: "No tienes permisos para editar este usuario",
      });
    }

    // =====================================
    // SEGURIDAD
    // =====================================

    // Un usuario normal NO puede cambiar roles
    if (!isAdmin) {
      delete datos.role;
      delete datos.banned;
    }

    const actualizado = await userService.updateUser(id, datos);

    return res.status(200).json({
      ok: true,
      datos: actualizado,
      mensaje: "Usuario actualizado correctamente",
    });

  } catch (err) {

    logMensaje("Error en updateUser:", err);

    return res.status(500).json({
      ok: false,
      datos: null,
      mensaje: "Error al actualizar el usuario",
    });
  }
}

  // =========================
  // RESET PASSWORD
  // =========================
  async resetPasswordByEmail(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Faltan datos",
      });
    }

    try {
      const ok = await userService.resetPasswordByEmail(email, password);

      if (!ok) {
        return res.status(404).json({
          ok: false,
          mensaje: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        mensaje: "Contraseña actualizada correctamente",
      });

    } catch (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al resetear contraseña",
      });
    }
  }

  // =========================
  // DELETE USER (ADMIN ONLY)
  // =========================
  async deleteUser(req, res) {
    const id = req.params.id;

    try {
      const eliminado = await userService.deleteUser(id);

      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        datos: null,
        mensaje: "Usuario eliminado correctamente",
      });

    } catch (err) {
      logMensaje("Error en deleteUser:", err);

      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al eliminar el usuario",
      });
    }
  }
}

module.exports = new UserController();