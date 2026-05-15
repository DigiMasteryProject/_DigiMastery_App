const { logMensaje } = require("../utils/logger.js");
const digimonSkillService = require("../services/digimonSkillService.js");

class DigimonSkillController {
  async getAllDigimonSkills(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      if (req.query.id_uc) filtros.id_uc = req.query.id_uc;
      const digimonSkills = Object.keys(filtros).length ? await digimonSkillService.getAllDigimonSkills(filtros) : await digimonSkillService.getAllDigimonSkills();
      return res.status(200).json({
        ok: true,
        datos: digimonSkills,
        mensaje: "DigimonSkills recuperados correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllDigimonSkills:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar digimon skills",
      });
    }
  }

  async getDigimonSkillByIdDigimon(req, res) {
    const id = req.params.id;
    try {
      const u = await digimonSkillService.getDigimonSkillByDigimon(id);
      if (!u) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "DigimonSkill no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: u,
        mensaje: "DigimonSkill recuperado correctamente",
      });
    } catch (err) {
      logMensaje("Error en getDigimonSkillByIdDigimon:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar el digimon skill",
      });
    }
  }

  async getDigimonSkillsByIdSkill(req, res) {
    const userId = req.params.userId;
    try {
      const shards = await codeShardService.getDigimonSkillBySkill(id);
      return res.status(200).json({
        ok: true,
        datos: shards,
        mensaje: "DigimonSkills del digimon recuperados correctamente",
      });
    } catch (err) {
      logMensaje("Error en getDigimonSkillsByIdSkill:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar los digimon skills del digimon",
      });
    }
  }
}

module.exports = new DigimonSkillController();
