const Sequelize = require('sequelize');

module.exports = function(sequelize,DataTypes){
    return sequelize.define('campaign',{
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
        next_session:{
            type: DataTypes.DATE,
            allowNull: true
        },
        map:{
            type: DataTypes.STRING,
            allowNull: true
        },
        observations:{
            type: DataTypes.STRING,
            allowNull: true}
    },{
        sequelize,
        tableName: 'Campaign',
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