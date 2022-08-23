const express = require('express')
const { httpGetAllLaunches, httpAddAllLaunches, httpAbortLaunches } = require('./launchesController')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddAllLaunches)
launchesRouter.delete('/:id', httpAbortLaunches)

module.exports = launchesRouter