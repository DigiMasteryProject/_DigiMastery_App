function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        mensaje: "No autenticado",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        ok: false,
        mensaje: "Acceso denegado (ADMIN only)",
      });
    }

    next();
  } catch (err) {
    console.log("requireAdmin error:", err);

    return res.status(500).json({
      ok: false,
      mensaje: "Error de permisos",
    });
  }
}

module.exports = requireAdmin;