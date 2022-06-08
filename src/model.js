const { sequelize } = require('./schema')

const storeShortenURL = async (shorten, origin) => {
    let result
    try{
     result = await sequelize.URLModel.create({
        shorten: shorten,
        origin: origin,
    })
    }catch(error){
        return false
    }
    return result.shorten
}
const getOriginFromDB = async (shorten) => {
    const target = await sequelize.URLModel.findOne({
        where: { shorten: shorten },
    })
    if (!target) {
        throw new Error('shorten ID not found.')
    }
    return target.origin
}
module.exports = { storeShortenURL, getOriginFromDB }
