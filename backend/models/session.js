const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('session',{
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
        observation:{
            type: DataTypes.STRING,
            allowNull: true
        },
        date:{
            type: DataTypes.DATE,
            allowNull: false}
    },{
        sequelize,
        tableName: 'Session',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id"
            },]
        },{
            name: "id_uc",
            using: "BTREE",
            fields:[{
                name: "id_campaign"
            },]
        }]
    });
};