const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);

const { partner_digimon, user_campaign } = models;
const { Op } = require("sequelize");

class PartnerDigimonService {

  // =========================
  // GET ALL
  // =========================
  async getAllPartnerDigimons(filters = {}) {
    let where = {};

    // USER → solo sus digimon
    if (filters.id_user) {
      where.id_user = filters.id_user;
    }

    /**
     * DM → filtro por campañas:
     * NO usamos id_campaign en partner_digimon
     * sino que filtramos por usuarios que están en campañas del DM
     */
    if (filters.campaignIds) {

      const usersInCampaigns = await user_campaign.findAll({
        where: {
          id_campaign: {
            [Op.in]: filters.campaignIds
          }
        },
        attributes: ["id_user"]
      });

      const userIds = usersInCampaigns.map(u => u.id_user);

      where.id_user = {
        [Op.in]: userIds.length ? userIds : [-1]
      };
    }

    return await partner_digimon.findAll({
      where,
      attributes: [
        "id",
        "nickname",
        "level",
        "atk_ev",
        "def_ev",
        "spirit_ev",
        "spe_ev",
        "friendship",
        "id_digimon",
        "id_user"
      ]
    });
  }

  // =========================
  // GET BY ID
  // =========================
  async getPartnerDigimonById(id) {
    return await partner_digimon.findByPk(id, {
      attributes: [
        "id",
        "nickname",
        "level",
        "atk_ev",
        "def_ev",
        "spirit_ev",
        "spe_ev",
        "friendship",
        "id_digimon",
        "id_user"
      ]
    });
  }

  // =========================
  // CREATE
  // =========================
  async createPartnerDigimon(datos) {
    if (
      datos.id_digimon == null ||
      datos.level == null ||
      datos.atk_ev == null ||
      datos.def_ev == null ||
      datos.spirit_ev == null ||
      datos.spe_ev == null ||
      datos.friendship == null
    ) {
      throw new Error("Datos incompletos para crear digimon");
    }

    return await partner_digimon.create(datos);
  }

  // =========================
  // UPDATE
  // =========================
  async updatePartnerDigimon(id, datos) {
    const m = await partner_digimon.findByPk(id,{attributes: [
        "id",
        "nickname",
        "level",
        "atk_ev",
        "def_ev",
        "spirit_ev",
        "spe_ev",
        "friendship",
        "id_digimon",
        "id_user"
      ]});

    if (!m) return null;

    await m.update(datos);
    return m;
  }

  // =========================
  // DELETE
  // =========================
  async deletePartnerDigimon(id) {
    const m = await partner_digimon.findByPk(id);

    if (!m) return false;

    await m.destroy();
    return true;
  }

  async canDMAccessDigimon(digimonId, dmUserId) {
  const digimon = await partner_digimon.findByPk(digimonId);

  if (!digimon) return false;

  // campañas del DM
  const dmCampaigns = await user_campaign.findAll({
    where: { id_user: dmUserId },
    attributes: ["id_campaign"]
  });

  const campaignIds = dmCampaigns.map(c => c.id_campaign);

  if (!campaignIds.length) return false;

  // usuarios que están en campañas del DM
  const allowedUser = await user_campaign.findOne({
    where: {
      id_user: digimon.id_user,
      id_campaign: {
        [Op.in]: campaignIds
      }
    }
  });

  return !!allowedUser;
}
}

module.exports = new PartnerDigimonService();