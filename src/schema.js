const { Sequelize, DataTypes } = require('sequelize')
const database = 'url'
const sequelize = new Sequelize(`mysql://root:123456@localhost:3306/${database}`)
const defineSchema = async () => {
    const URLModel = sequelize.define('URL', {
        shorten: {
            type: DataTypes.STRING(7),
            allowNull: false,
            unique: true,
        },
        origin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{timestamps:false})
    sequelize.URLModel = URLModel
    await sequelize.sync({ force: true })
    
}

module.exports = { defineSchema, sequelize }
