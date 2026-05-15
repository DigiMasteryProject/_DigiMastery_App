const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { human } = models;

class HumanService {
  async getAllHumans(filters) {
  if (!filters) return await human.findAll({
    attributes: [
      'id', 'name', 'courage', 'intelligence', 'serenity',
      'strength', 'perception', 'skill', 'archetype', 'emblem', 'darkness', 'id_user'
    ]
  });

  const { Op } = require('sequelize');
  const where = {};

  if (filters.id_user) {
    where.id_user = filters.id_user;
  }

  return await human.findAll({
    where,
    attributes: [
      'id', 'name', 'courage', 'intelligence', 'serenity',
      'strength', 'perception', 'skill', 'archetype', 'emblem', 'darkness', 'id_user'
    ]
  });
}

  async getHumanById(id) {
    return await human.findByPk(id, {
      attributes: [
        'id', 'name', 'courage', 'intelligence', 'serenity',
        'strength', 'perception', 'skill', 'archetype', 'emblem', 'darkness', 'id_user'
      ]
    });
}

  async createHuman(datos) {
    // Validación mínima antes de crear
    if (!datos.name || !datos.courage || !datos.intelligence || !datos.serenity || !datos.strength
        || !datos.perception || !datos.skill || !datos.archetype
    ) {
      throw new Error("Datos incompletos para crear humano");
    }
    return await human.create(datos);
  }

  async updateHuman(id, datos) {
    const m = await human.findByPk(id, {
      attributes: [
        'id', 'name', 'courage', 'intelligence', 'serenity',
        'strength', 'perception', 'skill', 'archetype', 'emblem', 'darkness', 'id_user'
      ]
    });
    if (!m) return null;

    // Actualizamos solo los campos que lleguen
    await m.update(datos);
    return m;
  }

  async deleteHuman(id) {
    const m = await human.findByPk(id);
    if (!m) return false;

    await m.destroy();
    return true;
  }
}

module.exports = new HumanService();
