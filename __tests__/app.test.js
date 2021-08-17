require('dotenv').config();

const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const soupData = require('../data/soups.js');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
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

    test('GET /soups returns list of soups', async () => {
      const expectation = soupData.map(soup => soup.name);
      const expectedShape = {
        'id': 1,
        'name': 'spinach',
        'category': 'creamy',
        'seasonal': false,
        'tastiness': 8
      };
      // [
      //   {
      //     'id': 1,
      //     'name': 'spinach',
      //     'category': 'creamy',
      //     'seasonal': false,
      //     'tastiness': 8
      //   },
      //   {
      //     'id': 2,
      //     'name': 'minestrone',
      //     'category': 'brothy',
      //     'seasonal': false,
      //     'tastiness': 5
      //   },
      //   {
      //     'id': 3,
      //     'name': 'chickpea',
      //     'category': 'earthy',
      //     'seasonal': false,
      //     'tastiness': 7
      //   },
      //   {
      //     'id': 4,
      //     'name': 'mushroom',
      //     'category': 'hearty',
      //     'seasonal': true,
      //     'tastiness': 9
      //   },
      //   {
      //     'id': 5,
      //     'name': 'cauliflower',
      //     'category': 'creamy',
      //     'seasonal': false,
      //     'tastiness': 6
      //   }
      // ];

      const data = await fakeRequest(app)
        .get('/soups')
        .expect('Content-Type', /json/)
        .expect(200);
        
      const names = data.body.map(soup => soup.name);

      expect(names).toEqual(expectation);
      expect(names.length).toBe(soupData.length);
      expect(data.body[0]).toEqual(expectedShape);
    }, 20000);
    
    test('GET /soups/:id returns the individual soup', async () => {
      const expectation = {
        'id': 1,
        'name': 'spinach',
        'category': 'creamy',
        'seasonal': false,
        'tastiness': 8
      };
      // const expectation = soupData[0];
      // expectation.id = 1;
      
      const data = await fakeRequest(app)
        .get('/soups/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('POST /soups creates a new soup', async () => {
      const newSoup = {
        name: 'tear',
        category: 'salty',
        seasonal: false,
        tastiness: 1
      };

      const data = await fakeRequest(app)
        .post('/soups')
        .send(newSoup)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(newSoup.name);
      expect(data.body.id).toBeGreaterThan(0);
    });

    test('PUT /soups/:id updates soup', async () => {
      const updatedData = {
        'name': 'spinach',
        'category': 'hearty',
        'seasonal': false,
        'tastiness': 6
      };
      const data = await fakeRequest(app)
        .put('/soups/1')
        .send(updatedData)
        // .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.name).toEqual(updatedData.name);
      expect(data.body.category).toEqual(updatedData.category);
      expect(data.body.tastiness).toEqual(updatedData.tastiness);
    });
  });
});