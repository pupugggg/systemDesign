const { urlencoded, json } = require('express')
const express = require('express')
const {defineSchema} = require('./src/schema')
defineSchema()
const app = express()
app.use(urlencoded({ extended: false }))
app.use(json({}))
app.use(require('./src/router') )
app.use((error, req, res, next) => {
    res.json({ msg: error.message, stack: error.stack })
})
const port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
