const { logMensaje } = require("../utils/logger.js");
const skillService = require("../services/skillService.js");

class SkillController {
  async getAllSkills(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      if (req.query.name) filtros.name = req.query.name;
      const skills = Object.keys(filtros).length ? await skillService.getAllSkills(filtros) : await skillService.getAllSkills();
      return res.status(200).json({
        ok: true,
        datos: skills,
        mensaje: "Habilidades recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllSkills:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar habilidades",
      });
    }
  }

  async getSkillById(req, res) {
    const id = req.params.id;
    try {
      const skill = await skillService.getSkillById(id);
      if (!skill) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Habilidad no encontrada",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: skill,
        mensaje: "Habilidad recuperada correctamente",
      });
    } catch (err) {
      logMensaje("Error en getSkillById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar la habilidad",
      });
    }
  }

  async getSkillsByElement(req, res) {
    const element = req.params.element;
    try {
      const skills = await skillService.getSkillsByElement(element);
      return res.status(200).json({
        ok: true,
        datos: skills,
        mensaje: "Habilidades recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getSkillsByElement:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar habilidades por elemento",
      });
    }
  }
      
}

module.exports = new SkillController();
