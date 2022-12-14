const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../dbConnect');
const { loadPlanetsData } = require('../../model/planetsModel');

beforeAll(async () => {
  await mongoConnect();
  await loadPlanetsData();
});

afterAll(async () => {
  await mongoDisconnect();
});

describe('Test GET /v1/launches', () => {
    test('should respond with 200 success', async () => { 
        const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
});

describe('Test GET /v1/planets', () => {
  test('should respond with 200 success', async () => { 
      const response = await request(app)
      .get('/v1/planets')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /v1/launches', () => {
    const completeLaunchData = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-296 A f',
        launchDate: 'January 4, 2028',
    };
    
    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-296 A f',
    };

    const launchDataWithInvalidDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-296 A f',
        launchDate: 'zoot',
    };

    test('It should respond with 201 seuccess', async () => {
        const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);
    
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required properties', async () => {
        const response = await request(app)
          .post('/v1/launches')
          .send(launchDataWithoutDate)
          .expect('Content-Type', /json/)
          .expect(401);
    
        expect(response.body).toStrictEqual({
          error: 'Missing required values',
        });
      });

    test('It should catch invalid dates', async () => {
        const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
});
