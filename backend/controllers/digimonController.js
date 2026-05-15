const { logMensaje } = require("../utils/logger.js");
const digimonService = require("../services/digimonService.js");

class DigimonController {
  async getAllDigimon(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      if (req.query.name) filtros.name = req.query.name;
      const digimons = Object.keys(filtros).length ? await digimonService.getAllDigimon(filtros) : await digimonService.getAllDigimon();
      return res.status(200).json({
        ok: true,
        datos: digimons,
        mensaje: "Digimon recuperados correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllDigimon:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar digimon",
      });
    }
  }

  async getDigimonById(req, res) {
    const id = req.params.id;
    try {
      const d = await digimonService.getDigimonById(id);
      if (!d) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Digimon no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: d,
        mensaje: "Digimon recuperado correctamente",
      });
    } catch (err) {

  console.log("=================================");
  console.log("ERROR REAL getDigimonById");
  console.log(err);
  console.log(err.message);
  console.log(err.stack);
  console.log("=================================");

  return res.status(500).json({
    ok: false,
    datos: null,
    mensaje: err.message,
  });
    }
  }
}

module.exports = new DigimonController();
