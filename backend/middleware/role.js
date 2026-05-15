function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      mensaje: "No autenticado",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      ok: false,
      mensaje: "Acceso denegado: se requiere admin",
    });
  }

  next();
}

function isUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      mensaje: "No autenticado",
    });
  }

  if (!["user", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      ok: false,
      mensaje: "Acceso denegado",
    });
  }

  next();
}

module.exports = {
  isAdmin,
  isUser,
};