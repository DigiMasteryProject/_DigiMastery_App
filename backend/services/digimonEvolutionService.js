const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { digimon_evolution } = models;

class DigimonEvolutionService {
  async getAllDigimonEvolution(filters) {
    // If no filters provided, return all
    if (!filters) return await digimon_evolution.findAll();

    const { Op } = require('sequelize');
    const where = {};
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    return await digimon_evolution.findAll({ where });
  }

  async getDigimonEvolutionById(id) {
    return await digimon_evolution.findByPk(id);
  }

  async getDigimonEvolutionByBaseDigimonId(baseDigimonId) {
    return await digimon_evolution.findAll({ where: { base_digimon_id: baseDigimonId } });
  }

  async getDigimonEvolutionByNewDigimonId(newDigimonId) {
    return await digimon_evolution.findAll({ where: { new_digimon_id: newDigimonId } });
  }
}

module.exports = new DigimonEvolutionService();
