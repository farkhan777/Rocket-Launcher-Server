const axios = require('axios')

const launchesDatabase = require('./launchesMongo')
const planet = require('./planetsMongo')

const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query'

// const launches = new Map();

// let latestFlightNumber = 0
const DEFAULT_FLIGHT_NUMBER = 0 

// const launch = {
//     flightNumber: 100, // flight_number
//     mission: 'Kepler Exploration', // name
//     rocket: 'Explorer IS1', // rocket.name
//     launchDate: new Date('December 27, 2030'), // date_local
//     target: 'Kepler-296 A f', // not applicable
//     customer: ['ZTM', 'NASA'], // payload.customer for each payload
//     upcoming: true, // upcaming
//     success: true, // success
// };

// launches.set(launch.flightNumber, launch);

// saveNewLaunches(launch)

// function existsLaunchWithId(launchId) {
//     return launches.has(launchId)
// }

async function populateLaunches() {
    console.log('Downloading launch data...')
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem downloading launch data')
        throw new Error('Launch data download failed')
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission} ${customers}`);

        await saveNewLaunches(launch)
    }   
}

async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    console.log(firstLaunch)

    if (firstLaunch) {
        console.log('Launch data already loaded')
    } else {
        await populateLaunches()
    }
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter)
}

async function existsLauchId(launchId) {
    const existId = await launchesDatabase.findOne({
        flightNumber: launchId
    })

    return existId
}

async function getLatestFlightNumber() {
    const latestFlightNumber = await launchesDatabase.findOne().sort('-flightNumber') // "-" in flightNumber means descending

    if (!latestFlightNumber) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestFlightNumber.flightNumber
}

async function getAllLaunches(limit, skip) {
    // return Array.from(launches.values());
    return await launchesDatabase.find({}, {
        "_id": 0,
        "__v": 0
    })
    .sort({ flightNumber: 1 }) // you can use 1 for ascending or -1 for descending
    .skip(skip)
    .limit(limit)
}

async function scheduleNewLaunch(launch) {

    const planetExist = await planet.findOne({
        keplerName: launch.target,
    })

    if (!planetExist) {
        throw new Error('Planet not found')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign({
        flightNumber: newFlightNumber,
        customers: ['Zero to Mastery', 'NASA'],
        upcoming: true,
        success: true,
    }, launch)
    await saveNewLaunches(newLaunch)
}

// function addNewLaunches(launch) {
//     latestFlightNumber++
//     launches.set(
//         latestFlightNumber, 
//         Object.assign({
//             flightNumber: latestFlightNumber,
//             customer: ['Zero to Mastery', 'NASA'],
//             upcoming: true,
//             success: true,
//         }, launch)
//     )
// }

async function saveNewLaunches(launch) {
    try {
        await launchesDatabase.findOneAndUpdate({
            flightNumber: launch.flightNumber
        }, launch, {
            upsert: true 
        })
    } catch(err) {
        console.log(err)
    }
}

async function abortLaunchById(launchId) {
    // const aborted = launches.get(launchId)
    // aborted.upcoming = false
    // aborted.success = false
    // return aborted

    const aborted = await launchesDatabase.findOneAndUpdate({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })

    return aborted
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    // addNewLaunches,
    existsLauchId,
    scheduleNewLaunch,
    // existsLaunchWithId,
    abortLaunchById,
}