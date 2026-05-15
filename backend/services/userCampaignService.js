const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { user_campaign } = models;

class UserCampaignService {

  async getAll(filters = {}) {
    const where = {};

    // 🔥 FIX: evitar undefined que rompe Sequelize
    if (filters.id_campaign !== undefined && filters.id_campaign !== null) {
      where.id_campaign = filters.id_campaign;
    }

    if (filters.id_user !== undefined && filters.id_user !== null) {
      where.id_user = filters.id_user;
    }

    return await user_campaign.findAll({ where });
  }

  async getUserCampaignById(id) {
    return await user_campaign.findByPk(id);
  }

  async createUserCampaign(datos) {
    if (!datos?.id_user || !datos?.id_campaign || !datos?.role) {
      throw new Error("Datos incompletos para crear user_campaign");
    }

    return await user_campaign.create(datos);
  }

  async updateUserCampaign(id, datos) {
    const m = await user_campaign.findByPk(id);
    if (!m) return null;

    await m.update(datos);
    return m;
  }

  async deleteUserCampaign(id) {
    const m = await user_campaign.findByPk(id);
    if (!m) return false;

    await m.destroy();
    return true;
  }
}

module.exports = new UserCampaignService();