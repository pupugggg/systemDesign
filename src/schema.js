const { Sequelize, DataTypes } = require('sequelize')
const DB_URLs = process.env.SHARD_POOL.split(',')
const replicaPerShard = parseInt(process.env.REPLICA_PER_SHARD)
const SHARD_POOL = []
const READPOOL = new Map()

for (let i = 0; i < DB_URLs.length; i++) {
    const connectionString =
        'mysql://' +
        process.env.DB_CREDENTIAL +
        '@' +
        DB_URLs[i] +
        process.env.SHARD_URL
    SHARD_POOL.push(
        new Sequelize(connectionString, {
            define: { charset: 'utf8', collate: 'utf8_bin' },
        })
    )
    for (let j = 0; j < replicaPerShard ; j++) {
        const shardString =
            'mysql://' +
            process.env.DB_CREDENTIAL +
            '@' +
            DB_URLs[i] +
            '-' +
            j.toString() +
            process.env.SHARD_URL
        READPOOL.set(
            DB_URLs[i] + '-' + j.toString(),
            new Sequelize(shardString)
        )
    }
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
        for (let j = 0; j < replicaPerShard ; j++) {
            const instance = READPOOL.get(DB_URLs[i] + '-' + j.toString())
            const RepModel = instance.define(
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
            instance.URLModel = RepModel
            READPOOL.set(DB_URLs[i] + '-' + j.toString(),instance)
            await instance.sync({})
        }
    }
}

module.exports = {
    defineSchema,
    SHARD_POOL,
    READPOOL,
    DB_URLs,
    replicaPerShard,
}
