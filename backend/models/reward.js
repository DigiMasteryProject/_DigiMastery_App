const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('reward',{
        id:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        slot_1:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        slot_2:{
            type: DataTypes.INTEGER,
            allowNull: false},
        slot_3:{
            type: DataTypes.INTEGER,
            allowNull: false},
        slot_4:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        slot_5:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        slot_6:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        sequelize,
        tableName: 'Reward',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id"
            },]
        }]
    });
};