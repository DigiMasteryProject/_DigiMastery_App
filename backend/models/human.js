const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('human',{
        id:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        courage:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        intelligence:{
            type: DataTypes.STRING,
            allowNull: false},
        serenity:{
            type: DataTypes.STRING,
            allowNull: false},
        strength:{
            type: DataTypes.STRING,
            allowNull: false
        },
        perception:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        skill:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        archetype:{
            type: DataTypes.STRING,
            allowNull: false
        },
        emblem:{
            type: DataTypes.STRING,
            allowNull: true
        },
        darkness:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_user:{
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },{
        sequelize,
        tableName: 'Human',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id"
            },]
        },{
            name: "id_user",
            using: "BTREE",
            fields:[{
                name: "id_user"
            },]
        }]
    });
};