const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('family',{
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
        atk_given_ev:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        def_given_ev:{
            type: DataTypes.INTEGER,
            allowNull: false}
        ,
        spirit_given_ev:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        speed_given_ev:{
            type: DataTypes.INTEGER,
            allowNull: false}
    },{
        sequelize,
        tableName: 'Family',
        timestamps: false,
        indexes:[{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields:[{
                name: "id"
            },]
        },]
    });
};