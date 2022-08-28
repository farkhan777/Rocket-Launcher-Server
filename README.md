# Rocket Launcher API Project

## Getting Started

1. Ensure you have Node.js installed.
2. Create a free [Mongo Atlas](https://www.mongodb.com/atlas/database) database online or start a local MongoDB database.
3. Create a `server/.env` file with a `MONGO_URL` property set to your MongoDB connection string.
4. In the terminal, run: `npm install`

## Running the Project
1. Change cors origin in app.js from "http://108.136.237.66:5000" to "http://localhost:3000"
2. In the terminal, run: `npm start`
3. Browse to the mission control frontend at [localhost:3000](http://localhost:3000) and schedule an interstellar launch!

## Docker

1. Ensure you have the latest version of Docker installed
2. Run `docker build -t nasa-project .`
3. Run `docker run -it -p 5000:5000 nasa-project`

## Running the Tests

To run any automated tests, run `npm test-watch` or `npm test`.
