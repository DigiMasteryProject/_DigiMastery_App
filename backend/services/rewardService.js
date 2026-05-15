const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { reward } = models;

class RewardService {
  async getAllRewards(filters) {
    // If no filters provided, return all
    if (!filters) return await reward.findAll();

    const { Op } = require('sequelize');
    const where = {};
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    return await reward.findAll({ where });
  }

  async getRewardById(id) {
    return await reward.findByPk(id);
  }
}

module.exports = new RewardService();
