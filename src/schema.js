
const { Sequelize, DataTypes } = require('sequelize')
console.log(process.env.DB_URL)
const sequelize = new Sequelize(process.env.DB_URL)
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
