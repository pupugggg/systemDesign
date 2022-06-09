const { Sequelize, DataTypes } = require('sequelize')
const DB_URLs = process.env.SHARD_POOL.split(',')
const replicaPerShard = parseInt(process.env.REPLICA_PER_SHARD)
const SHARD_POOL = []

for (let i = 0; i < DB_URLs.length; i++) {
    const connectionString = DB_URLs[i] + process.env.SHARD_URL
    const replicas = []

    for (let j = 0; j < replicaPerShard; j++) {
        replicas.push({
            host: DB_URLs[i] + '-' + j.toString() + process.env.SHARD_URL,
            username: process.env.user,
            password: process.env.password,
        })
    }
    SHARD_POOL.push(
        new Sequelize('url', null, null, {
            dialect: 'mysql',
            port: 3306,
            replication: {
                read: replicas,
                write: {
                    host: connectionString,
                    username: process.env.user,
                    password: process.env.password,
                },
            },
            define: { charset: 'utf8', collate: 'utf8_bin' },
        })
    )
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

module.exports = {
    defineSchema,
    SHARD_POOL,
    DB_URLs,
    replicaPerShard,
}
