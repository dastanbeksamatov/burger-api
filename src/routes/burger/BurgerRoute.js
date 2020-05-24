const Burger = require('../../models/Burger');

const getBurgers = async (request, response) => {
  // page is 1 and per_page is 10, if not specified by query
  const page = request.query.page ? request.query.page : 1;
  const per_page = request.query.per_page ? request.query.per_page : 10;
  // query parameters, value if exists, default value if not
  const burger_name = request.query.name ? request.query.name : '';
  const tag_name = request.query.tag ? request.query.tag : '';
  const origin_name = request.query.origin ? request.query.origin : '';
  const rating = request.query.min_rating ? request.query.min_rating : 0;
  const ingredient = request.query.ingredient ? request.query.ingredient : '';

  const burgers = await Burger.list({
    'offset': Number(page),
    'limit': Number(per_page),
    'burger_name': burger_name,
    'tag_name': tag_name,
    'origin_name': origin_name,
    'rating': rating,
    'ingredient': ingredient
  });
  response.status(200).send(burgers.map(burger => burger.toJSON()));
};

const getById = async(request, response) => {
  try{
    const id = request.params.id;
    const burger = await Burger.findById(id);
    response.status(200).send(burger.toJSON());
  }
  catch(e){
    response.status(400).send('Bad request');
  }
};

const addBurger = async(request, response) => {
  console.log('req is ' + request.body.name);
  try{
    const newBurger = await Burger.addBurger(request.body);
    response.status(200).send(newBurger.toJSON());
  }
  catch(e){
    response.status(400).send('Bad request: ' + e.message);
  }
};

module.exports = {
  getBurgers,
  getById,
  addBurger
};