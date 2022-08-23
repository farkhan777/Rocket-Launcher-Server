const mongoose = require('mongoose')

require('dotenv').config()

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

const MONGO_URL = 'mongodb://nasa:sEMn0XCFectUJej3@ac-rdk9lei-shard-00-00.tk1fjls.mongodb.net:27017,ac-rdk9lei-shard-00-01.tk1fjls.mongodb.net:27017,ac-rdk9lei-shard-00-02.tk1fjls.mongodb.net:27017/nasa?ssl=true&replicaSet=atlas-j9yahd-shard-0&authSource=admin&retryWrites=true&w=majority'

async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}