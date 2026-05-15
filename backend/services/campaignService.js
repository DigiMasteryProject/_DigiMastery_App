const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { campaign, session } = models; // 👈 añadimos session

class CampaignService {
  async getAllCampaigns(filters) {
    if (!filters) {
      const campaigns = await campaign.findAll();

      // 👇 añadimos session_count a cada campaña
      return await Promise.all(
        campaigns.map(async (c) => {
          const count = await session.count({
            where: { id_campaign: c.id },
          });

          return {
            ...c.toJSON(),
            session_count: count,
          };
        })
      );
    }

    const { Op } = require('sequelize');
    const where = {};

    const campaigns = await campaign.findAll({ where });

    return await Promise.all(
      campaigns.map(async (c) => {
        const count = await session.count({
          where: { id_campaign: c.id },
        });

        return {
          ...c.toJSON(),
          session_count: count,
        };
      })
    );
  }

  async getCampaignById(id) {
    const c = await campaign.findByPk(id);
    if (!c) return null;

    // 👇 AQUÍ está lo importante
    const count = await session.count({
      where: { id_campaign: id },
    });

    return {
      ...c.toJSON(),
      session_count: count,
    };
  }

  async createCampaign(datos) {
    return await campaign.create(datos);
  }

  async updateCampaign(id, datos) {
    const m = await campaign.findByPk(id);
    if (!m) return null;

    await m.update(datos);
    return m;
  }

  async deleteCampaign(id) {
    const m = await campaign.findByPk(id);
    if (!m) return false;

    await m.destroy();
    return true;
  }
}

module.exports = new CampaignService();