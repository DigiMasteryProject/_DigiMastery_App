const { logMensaje } = require("../utils/logger.js");
const digimonEvolutionService = require("../services/digimonEvolutionService.js");

class DigimonEvolutionController {
  async getAllDigimonEvolution(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      if (req.query.name) filtros.name = req.query.name;
      const digimons = Object.keys(filtros).length ? await digimonEvolutionService.getAllDigimonEvolution(filtros) : await digimonEvolutionService.getAllDigimonEvolution();
      return res.status(200).json({
        ok: true,
        datos: digimons,
        mensaje: "Evoluciones recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllDigimonEvolution:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar evoluciones",
      });
    }
  }

  async getDigimonEvolutionById(req, res) {
    const id = req.params.id;
    try {
      const d = await digimonEvolutionService.getDigimonEvolutionById(id);
      if (!d) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Evolución no encontrada",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: d,
        mensaje: "Evolución recuperada correctamente",
      });
    } catch (err) {
      logMensaje("Error en getDigimonEvolutionById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar la evolución",
      });
    }
  }

  async getDigimonEvolutionByBaseDigimonId(req, res) {
    const id = req.params.id;
    try {
      const d = await digimonEvolutionService.getDigimonEvolutionByBaseDigimonId(id);
      if (!d) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Evolución no encontrada",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: d,
        mensaje: "Evolución recuperada correctamente",
      });
    } catch (err) {
      logMensaje("Error en getDigimonEvolutionById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar la evolución",
      });
    }
  }

  async getDigimonEvolutionByNewDigimonId(req, res) {
    const newDigimonId = req.params.newDigimonId;
    try {
      const evolutions = await digimonEvolutionService.getDigimonEvolutionByNewDigimonId(newDigimonId);
      return res.status(200).json({
        ok: true,
        datos: evolutions,
        mensaje: "Evoluciones recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getDigimonEvolutionByNewDigimonId:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar evoluciones",
      });
    }
  }
      
}

module.exports = new DigimonEvolutionController();
