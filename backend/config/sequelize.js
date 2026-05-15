// config/sequelize.js

const { logMensaje } = require("../utils/logger.js");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",

    logging: false,

    dialectOptions: {
      connectTimeout: 60000,
      multipleStatements: true,
    },
  }
);

// =====================================
// TEST CONNECTION
// =====================================

(async () => {
  try {
    await sequelize.authenticate();

    if (process.env.NODE_ENV !== "test") {
      logMensaje("✅ Conexión exitosa a MySQL");
    }

  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
})();

module.exports = sequelize;
