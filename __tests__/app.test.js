require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns soups', async() => {
      const expectation = [
        {
          'id': 1,
          'name': 'spinach',
          'category': 'creamy',
          'seasonal': false,
          'tastiness': 8
        },
        {
          'id': 2,
          'name': 'minestrone',
          'category': 'brothy',
          'seasonal': false,
          'tastiness': 5
        },
        {
          'id': 3,
          'name': 'chickpea',
          'category': 'earthy',
          'seasonal': false,
          'tastiness': 7
        },
        {
          'id': 4,
          'name': 'mushroom',
          'category': 'hearty',
          'seasonal': true,
          'tastiness': 9
        },
        {
          'id': 5,
          'name': 'cauliflower',
          'category': 'creamy',
          'seasonal': false,
          'tastiness': 6
        }
      ];

      const data = await fakeRequest(app)
        .get('/soups')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
