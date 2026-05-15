const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token requerido",
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token mal formado",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token inválido o expirado",
    });
  }
}

module.exports = auth;