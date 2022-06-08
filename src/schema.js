const { Sequelize, DataTypes } = require('sequelize')
const DB_URLs = process.env.SHARD_POOL.split(',')
const SHARD_POOL = []
for (let i = 0; i < DB_URLs.length; i++) {
    SHARD_POOL.push(new Sequelize(DB_URLs[i],{define:{charset:'utf8',collate:'utf8_bin'}}))
}

const defineSchema = async () => {
    for (let i = 0; i < SHARD_POOL.length; i++) {

        const URLModel = SHARD_POOL[i].define(
            'URL',
            {
                shorten: {
                    type: DataTypes.STRING(7),
                    allowNull: false,
                    unique: true,
                },
                origin: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            { timestamps: false }
        )
        SHARD_POOL[i].URLModel = URLModel
        await SHARD_POOL[i].sync({ force: true })
    }
}

module.exports = { defineSchema, SHARD_POOL }
