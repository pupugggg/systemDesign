const router = require("express").Router()
const {getOriginURL,shortenURL} = require('./controller')
router.route('/shorten').post(shortenURL)
router.route('/:id').get(getOriginURL)
module.exports = router
