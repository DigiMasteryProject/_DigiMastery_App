const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('other_digimon',{
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
        speed_ev:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        sequelize,
        tableName: 'OtherDigimon',
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
        }]
    });
};