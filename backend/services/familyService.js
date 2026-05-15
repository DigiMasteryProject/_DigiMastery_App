const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { family } = models;

class FamilyService {
  async getAllFamilies(filters) {
    // If no filters provided, return all
    if (!filters) return await family.findAll();

    const { Op } = require('sequelize');
    const where = {};
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    return await family.findAll({ where });
  }

  async getFamilyById(id) {
    return await family.findByPk(id);
  }
}
module.exports = new FamilyService();
