const { logMensaje } = require("../utils/logger.js");
const familyService = require("../services/familyService.js");

class FamilyController {
  async getAllFamilies(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      if (req.query.name) filtros.name = req.query.name;
      const families = Object.keys(filtros).length ? await familyService.getAllFamilies(filtros) : await familyService.getAllFamilies();
      return res.status(200).json({
        ok: true,
        datos: families,
        mensaje: "Familias recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllFamilies:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar familias",
      });
    }
  }

  async getFamilyById(req, res) {
    const id = req.params.id;
    try {
      const family = await familyService.getFamilyById(id);
      if (!family) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Familia no encontrada",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: family,
        mensaje: "Familia recuperada correctamente",
      });
    } catch (err) {
      logMensaje("Error en getFamilyById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar la familia",
      });
    }
  }
      
}

module.exports = new FamilyController();
