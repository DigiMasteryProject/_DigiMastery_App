const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const {Op} = require("sequelize")

const {
  digimon,
  digimon_skill,
  skill
} = models;

class DigimonService {
  async getAllDigimon(filters) {
    // If no filters provided, return all
    if (!filters) return await digimon.findAll();

    const { Op } = require('sequelize');
    const where = {};
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    return await digimon.findAll({ where });
  }

  async getDigimonById(id) {

  // =========================
    // DIGIMON BASE
    // =========================
    const digi = await digimon.findByPk(id);

    if (!digi) {
      return null;
    }

    // =========================
    // RELACIONES
    // =========================
    const digiSkills = await digimon_skill.findAll({
      where: {
        id_digimon: id
      }
    });

    // Si no tiene skills
    if (!digiSkills.length) {
      return {
        ...digi.toJSON(),
        skills: []
      };
    }

    // =========================
    // IDS DE SKILLS
    // =========================
    const skillIds = digiSkills.map(ds => ds.id_skill);

    // =========================
    // RECUPERAR SKILLS
    // =========================
    const skills = await skill.findAll({
      where: {
        id_skill: {
          [Op.in]: skillIds
        }
      }
    });

    // =========================
    // FORMATEAR
    // =========================
    const formattedSkills = skills.map(s => {

      const relation = digiSkills.find(
        ds => ds.id_skill === s.id_skill
      );

      return {
        id_skill: s.id_skill,
        name: s.name,
        type: s.type,
        element: s.element,
        description: s.description,
        MP_Cost: s.MP_Cost,
        learning: relation?.learning || ""
      };
    });

    // =========================
    // RETURN
    // =========================
    return {
      ...digi.toJSON(),
      skills: formattedSkills
    };

  } catch (err) {

    console.log("ERROR getDigimonById:", err);

    throw err;
  }
}

module.exports = new DigimonService();
