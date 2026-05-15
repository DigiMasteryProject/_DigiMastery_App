const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { npc } = models;

class NpcService {
  async getAllNpcs() {
    // If no filters provided, return all 
    const where = {};
    return await npc.findAll();
  }

  async getNpcById(id) {
    return await npc.findByPk(id);
  }

   async getNpcByCampaign(campaignId, type = null) {
  const where = {
    id_campaign: campaignId,
  };

  if (type === "digimon") {
    where.type = "digimon";
    where.id_human = null;
  }

  if (type === "human") {
    where.type = "human";
    where.id_digimon = null;
  }

  return await npc.findAll({ where });
}
  async createNpc(datos) {
    // Validación mínima antes de crear
    if (!datos.id_campaign || !datos.type) {
      throw new Error("Datos incompletos para crear npc");
    }
    return await npc.create(datos);
  }

  async updateNpc(id, datos) {
    const m = await npc.findByPk(id);
    if (!m) return null;

    // Actualizamos solo los campos que lleguen
    await m.update(datos);
    return m;
  }

  async deleteNpc(id) {
    const m = await npc.findByPk(id);
    if (!m) return false;

    await m.destroy();
    return true;
  }
}

module.exports = new NpcService();
