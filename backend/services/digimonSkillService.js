const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { digimon_skill } = models;

class DigimonSkillService {
  async getAllDigimonSkills() {
    // If no filters provided, return all 
    const where = {};
    return await digimon_skill.findAll();
  }

  async getDigimonSkillByDigimon(id) {
    return await digimon_skill.findAll({ where: { id_digimon: id } });
  }

  async getDigimonSkillBySkill(id) {
    return await digimon_skill.findAll({ where: { id_skill: id } });
  }
}

module.exports = new DigimonSkillService();
