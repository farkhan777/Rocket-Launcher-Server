const { getAllLaunches, addNewLaunches, scheduleNewLaunch, launches, existsLaunchWithId, abortLaunchById, existsLauchId } = require('../../model/launchesModel');
const { getPagination } = require('../../query');

async function httpGetAllLaunches(req, res) {
    console.log(req.query)
    const {limit, skip} = getPagination(req.query)
    return res.status(200).json( await getAllLaunches(limit, skip))
}

async function httpAddAllLaunches(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(401).json({
            error: 'Missing required values'
        })
    }

    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }

    // addNewLaunches(launch)
    await scheduleNewLaunch(launch)
    console.log(launch)
    res.status(201).json(launch)
}

async function httpAbortLaunches(req, res) {
    const launchId = Number(req.params.id)

    // if (!existsLaunchWithId(launchId)) {
    //     return res.status(404).json({
    //         error: 'Launch not found'
    //     })
    // }

    if (!await existsLauchId(launchId)) {
        return res.status(404).json({
            error: 'Launch not found'
        })
    }

    const aborted = await abortLaunchById(launchId)
    if (!aborted) {
        return res.status(400)
    }

    return res.status(200).json(aborted)
}

module.exports = {
    httpGetAllLaunches,
    httpAddAllLaunches,
    httpAbortLaunches,
}