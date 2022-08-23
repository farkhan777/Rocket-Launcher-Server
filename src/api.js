const express = require('express')
const planetsRouter = require('./routes/planets/planetsRouter')
const launchesRouter = require('./routes/launches/launchesRouter')

const api = express()

api.use('/planets', planetsRouter)
api.use('/launches', launchesRouter)

module.exports = api