const express = require('express');
const Burger = require('../models/Burger');

const burgerRouter = express.Router();

burgerRouter.get('/', async (request, response) => {
  // page is 1 and per_page is 10, if not specified by query
  const page = request.query.page ? request.query.page : 1;
  const per_page = request.query.per_page ? request.query.per_page : 10;

  const burger_name = request.query.name ? request.query.name : '';
  const tag_name = request.query.tag ? request.query.tag : '';
  const origin_name = request.query.origin ? request.query.origin : '';

  const burgers = await Burger.list({
    'offset': Number(page),
    'limit': Number(per_page),
    'burger_name': burger_name,
    'tag_name': tag_name,
    'origin_name': origin_name
  });
  response.status(200).send(burgers.map(burger => burger.toJSON()));
});

burgerRouter.post('/', async(request, response) => {
  console.log('req is ' + request.body.name);
  const newBurger = await Burger.addBurger(request.body);
  response.status(200).send(newBurger.toJSON());
});

module.exports = burgerRouter;