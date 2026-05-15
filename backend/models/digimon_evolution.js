const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('digimon_evolution',{
        id_evo:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        base_digimon_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        new_digimon_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        evo_condition:{
            type: DataTypes.STRING,
            allowNull: false},
        slot:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true}
    },{
        sequelize,
        tableName: 'DigimonEvolution',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id_evo"
            },]
        },{
            name: "base_digimon_id",
            using: "BTREE",
            fields:[{
                name: "base_digimon_id"
            },]
        },{
            name: "new_digimon_id",
            using: "BTREE",
            fields:[{
                name: "new_digimon_id"
            },]
        }]
    });
};