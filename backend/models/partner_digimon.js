const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('partner_digimon',{
        id:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_digimon:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nickname:{
            type: DataTypes.STRING,
            allowNull: false},
        level:{
            type: DataTypes.INTEGER,
            allowNull: false},
        atk_ev:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        def_ev:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spirit_ev:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spe_ev:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        friendship:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_user:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        sequelize,
        tableName: 'PartnerDigimon',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id"
            },]
        },{
            name: "id_digimon",
            using: "BTREE",
            fields:[{
                name: "id_digimon"
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