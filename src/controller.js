const asyncHandler = require('express-async-handler')
const { storeShortenURL, getOriginFromDB } = require('./model')
const candidateChar =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const idLength = 7
const generateShorten = () => {
    let shorten = ''
    for (let i = 0; i < idLength; i++) {
        shorten =
            shorten +
            candidateChar[Math.floor(Math.random() * candidateChar.length)]
    }
    return shorten
}
const shortenURL = asyncHandler(async (req, res) => {
    const { originUrl } = req.body
    if (!originUrl) {
        res.status(400)
        throw new Error('originUrl can not be empty.')
    }
    let result = null
    do {
        const shorten = generateShorten()
        result = await storeShortenURL(shorten, originUrl)
    } while (!result)
    res.json({ id: result })
})
const getOriginURL = asyncHandler(async (req, res) => {
    const { id } = req.params
    const originUrl = await getOriginFromDB(id)
    res.json({ originUrl: originUrl })
})
module.exports = {
    shortenURL,
    getOriginURL,
}
