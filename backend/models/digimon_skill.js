const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('digimon_skill', {
    id_digimon: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Digimon',
        key: 'id'
      }
    },

    id_skill: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Skill',
        key: 'id_skill'
      }
    },

    learning: {
      type: DataTypes.STRING(255),
      allowNull: true
    }

  }, {
    sequelize,
    tableName: 'Digimon_Skill',
    timestamps: false
  });
};