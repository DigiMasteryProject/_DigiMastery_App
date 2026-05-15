const sequelize = require("../config/sequelize.js");
const initModels = require("../models/init-models").initModels;
const models = initModels(sequelize);
const { user } = models;
const bcrypt = require("bcryptjs");

class UserService {
  async getAllUsers(filters) {
    if (!filters) return await user.findAll();

    const { Op } = require("sequelize");
    const where = {};

    if (filters.username) {
      where.username = { [Op.like]: `%${filters.username}%` };
    }
    if (filters.role) {
      where.role = filters.role;
    }
    if (filters.banned) {
      where.banned = filters.banned;
    }

    return await user.findAll({ where });
  }

  async getUserById(id) {
    return await user.findByPk(id);
  }

  async getByUsername(username) {
    const users = await this.getAllUsers({ username });
    return users[0] || null;
  }

  async createUser(datos) {
    if (!datos.username || !datos.email || !datos.password) {
      throw new Error("Datos incompletos para crear usuario");
    }

    const hashedPassword = await bcrypt.hash(datos.password, 10);

    return await user.create({
      ...datos,
      password: hashedPassword,
    });
  }

  // 🔹 UPDATE GENERAL (sin lógica de reset)
  async updateUser(id, datos) {
    const u = await user.findByPk(id);
    if (!u) return null;

    const updateData = { ...datos };

    if (updateData.password) {
      const isHashed =
        updateData.password.startsWith("$2a$") ||
        updateData.password.startsWith("$2b$");

      if (!isHashed) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
    }

    await u.update(updateData);
    return u;
  }

  async resetPasswordByEmail(email, newPassword) {
  const u = await user.findOne({ where: { email } });
  if (!u) return null;

  const hashed = await bcrypt.hash(newPassword, 10);

  await u.update({ password: hashed });
  return true;
}

  async deleteUser(id) {
    const u = await user.findByPk(id);
    if (!u) return false;

    await u.destroy();
    return true;
  }
}

module.exports = new UserService();