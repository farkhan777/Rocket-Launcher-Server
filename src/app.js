const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const api = require('./api')

const app = express()

var corsOptions = {
    origin: 'http://localhost:3000'
}

app.use(morgan('combined'))

app.use(cors(corsOptions))
app.use(express.json())
app.use('/v1', api)

module.exports = app