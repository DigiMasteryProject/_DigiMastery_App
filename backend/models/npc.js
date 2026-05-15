const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('npc',{
        id:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_campaign:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_human:{
            type: DataTypes.INTEGER,
            allowNull: true},
        id_digimon:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        type:{
            type: DataTypes.ENUM('human', 'digimon'),
            allowNull: false
        }
    },{
        sequelize,
        tableName: 'NPC',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id"
            },]
        },{
            name: "id_campaign",
            using: "BTREE",
            fields:[{
                name: "id_campaign"
            },]
        },{
            name: "id_human",
            using: "BTREE",
            fields:[{
                name: "id_human"
            },]
        },{
            name: "id_digimon",
            using: "BTREE",
            fields:[{
                name: "id_digimon"
            },]
        }]
    });
};