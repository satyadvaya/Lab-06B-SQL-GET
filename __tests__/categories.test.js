require('dotenv').config();

const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const categoryData = require('../data/categories.js');

describe('category routes', () => {
  
  beforeAll(async () => {
    execSync('npm run setup-db');
  
    await client.connect();
    // const signInData = await fakeRequest(app)
    //   .post('/auth/signup')
    //   .send({
    //     email: 'jon@user.com',
    //     password: '1234'
    //   });
      
    // token = signInData.body.token; // eslint-disable-line
  }, 20000);
  
  afterAll(done => {
    return client.end(done);
  });

  test('GET /categories returns list of categories', async () => {
    const expected = categoryData.map(cat => cat.name);
    const data = await fakeRequest(app)
      .get('/categories')
      .expect('Content-Type', /json/)
      .expect(200);
      
    const categoryNames = data.body.map(cat => cat.name);
      
    expect(categoryNames).toEqual(expected);
    expect(categoryNames.length).toBe(categoryNames.length);
    expect(data.body[0].id).toBeGreaterThan(0);
  });
});