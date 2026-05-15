const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('code_shard',{
        id_shard:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_uc:{
            type: DataTypes.INTEGER,
            allowNull: false
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
        }
    },{
        sequelize,
        tableName: 'CodeShard',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id_shard"
            },]
        },{
            name: "id_uc",
            using: "BTREE",
            fields:[{
                name: "id_uc"
            },]
        }]
    });
};