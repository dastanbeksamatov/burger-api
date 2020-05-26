const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');
const api = supertest(app);
const helper = require('./test_helpers');
const Burger = require('../models/Burger');


describe('With non-empty DB', () => {

  beforeEach(async () => {
    // I empty the DB everytime before the testing
    await Burger.deleteMany({});

    for (let burger of helper.initialBurgers){
      let burgerObj = new Burger(burger);
      await burgerObj.save();
    }
  });

  describe('Format of GET request', () => {
    test('Burgers are returned as json', async () => {
      await api
        .get('/api/burgers')
        .expect(200)
        .expect('Content-type', /application\/json/);
    });

    test('First burger is Rafaels Burger (sorted by rating)', async () => {
      const response = await api.get('/api/burgers');
      const name = response.body.map(b => b.name);

      expect(name).toContain('Rafael\'s Burger');
    });

    test('There are as many burgers as in the initial DB', async () => {
      const response = await api.get('/api/burgers');
      expect(response.body).toHaveLength(helper.initialBurgers.length);
    });

    test('Burger by id works', async () => {
      const burgers = await helper.BurgersInDb();
      const burgerToView = burgers[0];

      const getBurger = await api
        .get(`/api/burgers/${burgerToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(getBurger.body).toEqual(burgerToView);
    });
  });

  describe('Testing queries', () => {
    test('Page number and per page works', async () => {
      const burgers = await api.get('/api/burgers?per_page=2');
      expect(burgers.body).toHaveLength(2);
    });

    test('Query by name works', async () => {
      const burgers = await api.get('/api/burgers?name=Rafael');
      expect(burgers.body.map(b => b.name)).toContain('Rafael\'s Burger');

      const otherBurgers = await api.get('/api/burgers?name=Cali burger');
      expect(otherBurgers.body.map(b => b.name)).toContain('Cali burger');
    });

    test('Query by rating works', async () => {
      const burgers = await api.get('/api/burgers?min_rating=9');
      expect(burgers.body).toHaveLength(helper.initialBurgers.filter(b => Number(b.rating) > 8).length);
    });

    test('Query by tag works', async () => {
      const burgers = await api.get('/api/burgers?tag=prime');
      expect(burgers.body.map(b => b.name)).toContain(helper.initialBurgers[1].name);
    });

    test('Query by ingredient works', async () => {
      const burgers = await api.get('/api/burgers?ingredient=cheddar');
      expect(burgers.body).toHaveLength(helper.initialBurgers.filter(b => b.ingredients.includes('cheddar')).length);
    });
  });

  describe('Adding new burger works', () => {
    test('Adding new burger works', async () => {
      await api
        .post('/api/burgers/')
        .send(helper.burgerToAdd)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const latestBurgers = await helper.BurgersInDb();
      expect(latestBurgers).toHaveLength(helper.initialBurgers.length + 1);
      const { body } = await api.get('/api/burgers');
      expect(body.map(b => b.name)).toContain(helper.burgerToAdd.name);
    });
  });
  describe('Rate limiter works', () => {
    test('Throws an error if ip exceeds 100 requests in an hour', async () => {
      let returnBurger = null;
      const limit = 100;
      for (var i=0; i<limit; i++){
        returnBurger = await api.get('/api/burgers');
      }
      expect(returnBurger.header.connection).toBe('close');
      expect(returnBurger.text).toBe('You have exceeded the 100 requests in 24 hrs limit!');
    });
  });
  afterAll(async done => {
    await mongoose.connection.close();
    done();
    console.log('closed db');
  });
});

