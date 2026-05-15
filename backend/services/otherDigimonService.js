const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { other_digimon } = models;

class OtherDigimonService {
  async getAllOtherDigimons(filters) {
    // If no filters provided, return all
    if (!filters) return await other_digimon.findAll();

    const { Op } = require('sequelize');
    const where = {};

    return await other_digimon.findAll({ where });
  }

  async getOtherDigimonById(id) {
    return await other_digimon.findByPk(id);
  }

  async createOtherDigimon(datos) {
    // Validación mínima antes de crear
    if (!datos.id_digimon || !datos.level) {
      throw new Error("Datos incompletos para crear digimon");
    }
    return await other_digimon.create(datos);
  }

  async updateOtherDigimon(id, datos) {
    const m = await other_digimon.findByPk(id);
    if (!m) return null;

    // Actualizamos solo los campos que lleguen
    await m.update(datos);
    return m;
  }

  async deleteOtherDigimon(id) {
    const m = await other_digimon.findByPk(id);
    if (!m) return false;

    await m.destroy();
    return true;
  }
}

module.exports = new OtherDigimonService();
