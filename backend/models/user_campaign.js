const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('user_campaign',{
        id_uc:{
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_user:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_campaign:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        human_sheet:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        partner_digimon:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        observations:{
            type: DataTypes.STRING,
            allowNull: true
        },
        role:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        sequelize,
        tableName: 'User_Campaign',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id_uc"
            },]
        },{
            name: "id_user",
            using: "BTREE",
            fields:[{
                name: "id_user"
            },]
        },{
            name: "id_campaign",
            using: "BTREE",
            fields:[{
                name: "id_campaign"
            },]
        },
        {
            name: "human_sheet",
            using: "BTREE",
            fields:[{
                name: "human_sheet"
            },]
        },{
            name: "partner_digimon",
            using: "BTREE",
            fields:[{
                name: "partner_digimon"
            },]
        }]
    });
};