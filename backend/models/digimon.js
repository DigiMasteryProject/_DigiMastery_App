const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('digimon',{
        id:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        family_tree:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attribute:{
            type: DataTypes.STRING,
            allowNull: false},
        element:{
            type: DataTypes.STRING,
            allowNull: false},
        growth_phase:{
            type: DataTypes.STRING,
            allowNull: false
        },
        health_points:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        skill_points:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attack:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        defense:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spirit:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        speed:{
            type: DataTypes.INTEGER,
            allowNull: false}
    },{
        sequelize,
        tableName: 'Digimon',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id"
            },]
        },{
            name: "family_tree",
            using: "BTREE",
            fields:[{
                name: "family_tree"
            },]
        }]
    });
};