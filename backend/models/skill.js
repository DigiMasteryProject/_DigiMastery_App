const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('skill',{
        id_skill:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false},
        element:{
            type: DataTypes.STRING,
            allowNull: false},
        description:{
            type: DataTypes.STRING,
            allowNull: false
        },
        MP_Cost:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        sequelize,
        tableName: 'Skill',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id_skill"
            },]
        }]
    });
};