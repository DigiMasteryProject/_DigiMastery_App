const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { skill } = models;

class SkillService {
  async getAllSkills(filters) {
    // If no filters provided, return all
    if (!filters) return await skill.findAll();

    const { Op } = require('sequelize');
    const where = {};
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.element) {
      where.element = filters.element;
    }

    return await skill.findAll({ where });
  }

  async getSkillById(id) {
    return await skill.findByPk(id);
  }

   async getSkillsByElement(element) {
    return await skill.findAll({ where: { element } });
  }
}
module.exports = new SkillService();
