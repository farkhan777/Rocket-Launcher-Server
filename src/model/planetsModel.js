const { parse } = require('csv-parse');
const { on } = require('events');
const path = require('path');
const fs = require('fs');
const { resolve } = require('path');

const habitablePlanets = require('./planetsMongo')

const planetsData = path.resolve(__dirname, "../../Data/kepler_data.csv")

// const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {        
        fs.createReadStream(planetsData)
            .pipe(parse({
                comment: "#",
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    // habitablePlanets.push(data);
                    // habitablePlanets.create({
                    //     keplerName: data.kepler_name
                    // })
                    savePlanet(data)
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err)
            })
            .on('end', async () => {
                const countPlanetData = (await getAllPlanets()).length;
                console.log(`${countPlanetData} planets found`);
                resolve()
            })
    })
}

async function getAllPlanets() {
    return await habitablePlanets.find({}, {
        "_id": 0,
        "__v": 0
    });
}

async function savePlanet(planet) {
    try {
        await habitablePlanets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.keplerName,
        }, {
            upsert: true
        })
    } catch(err) {
        console.log(`Could not save planet ${err}`)
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}