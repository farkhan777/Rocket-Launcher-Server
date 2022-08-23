const http = require('http')

require('dotenv').config()

const app = require('./app.js')
const { mongoConnect } = require('./dbConnect.js')
const { loadPlanetsData } = require('./model/planetsModel')
const { loadLaunchData} = require('./model/launchesModel')
const PORT = process.env.PORT || 7777

const server = http.createServer(app)

async function runServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();
    
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

runServer()
