const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { session } = models;

class SessionService {
  async getAllSessions(filtros = {}) {
  return await session.findAll({
    where: filtros,
  });
}

  async getSessionById(id) {
    return await session.findByPk(id);
  }

  async getSessionByCampaign(id) {
  return await session.findAll({
    where: {
      id_campaign: id,
    },
  });
}

  async createSession(datos) {
    // Validación mínima antes de crear
    if (!datos.id_campaign || !datos.date) {
      throw new Error("Datos incompletos para crear sesión");
    }
    return await session.create(datos);
  }

  async updateSession(id, datos) {
    const m = await session.findByPk(id);
    if (!m) return null;

    // Actualizamos solo los campos que lleguen
    await m.update(datos);
    return m;
  }

  async deleteSession(id) {
    const m = await session.findByPk(id);
    if (!m) return false;

    await m.destroy();
    return true;
  }
}

module.exports = new SessionService();
