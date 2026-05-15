const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { code_shard } = models;

class CodeShardService {
  async getAllCodeShards() {
    // If no filters provided, return all 
    const where = {};
    return await code_shard.findAll();
  }

  async getCodeShardById(id) {
    return await code_shard.findByPk(id);
  }

  async getCodeShardsByUserId(userId) {
    return await code_shard.findAll({ where: { id_uc: userId } });
  }

  async createCodeShard(datos) {
    // Validación mínima antes de crear
    if (!datos.id_uc || !datos.slot_1 || !datos.slot_2 || !datos.slot_3 || !datos.slot_4 
        || !datos.slot_5 || !datos.slot_6) {
      throw new Error("Datos incompletos para crear code shard");
    }
    return await code_shard.create(datos);
  }

  async updateCodeShard(id, datos) {
    const m = await code_shard.findByPk(id);
    if (!m) return null;

    // Actualizamos solo los campos que lleguen
    await m.update(datos);
    return m;
  }

  async deleteCodeShard(id) {
    const m = await code_shard.findByPk(id);
    if (!m) return false;

    await m.destroy();
    return true;
  }
}

module.exports = new CodeShardService();
