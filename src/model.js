const { SHARD_POOL } = require('./schema')

const assignShard = (shorten) => {
    const SHARD_AMOUNT = SHARD_POOL.length
    let sum = 0
    for (let i = 0; i < shorten.length; i++) {
        sum = sum + shorten.charCodeAt()
    }
    return sum % SHARD_AMOUNT
}

const storeShortenURL = async (shorten, origin) => {
    let result
    let sequelize = SHARD_POOL[assignShard(shorten)]
    try {
        result = await sequelize.URLModel.create({
            shorten: shorten,
            origin: origin,
        })
    } catch (error) {
        console.log(error.stack)
        return false
    }
    return result.shorten
}
const getOriginFromDB = async (shorten) => {
    let sequelize = SHARD_POOL[assignShard(shorten)]
    const target = await sequelize.URLModel.findOne({
        where: { shorten: shorten },
    })
    if (!target) {
        throw new Error('shorten ID not found.')
    }
    return target.origin
}
module.exports = { storeShortenURL, getOriginFromDB }
