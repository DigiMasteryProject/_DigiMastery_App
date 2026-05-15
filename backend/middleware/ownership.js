function ownershipByModel(getModel) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Admin bypass total
      if (req.user.role === "admin") {
        return next();
      }

      const model = await getModel(req);

      if (!model) {
        return res.status(404).json({
          ok: false,
          mensaje: "Recurso no encontrado",
        });
      }

      // 🔑 AQUÍ está tu lógica clave
      if (model.id_user !== userId) {
        return res.status(403).json({
          ok: false,
          mensaje: "No tienes permisos sobre este recurso",
        });
      }

      // todo correcto
      req.resource = model;

      next();
    } catch (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error en verificación de ownership",
      });
    }
  };
}

module.exports = ownershipByModel;