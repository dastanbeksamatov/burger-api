const Burger =  require('../models/Burger');

const initialBurgers = [
  {
    'ingredients': [
      'fried onions',
      'guacamole',
      'fried egg',
      'corn',
      'cheddar',
      'bacon',
      'bun',
      'tomato',
      'onion',
      'pickles',
      'lettuce',
      'mayo',
      'ketchup'
    ],
    'tags': [
      'prime'
    ],
    'name': 'Rafael\'s Burger',
    'description': 'Classic cheeseburger with fried onions, guacamole, fried egg, corn salad and cheddar cheese',
    'origin': 'Salvador',
    'rating': 9,
    'imgUrl': 'https://media-cdn.tripadvisor.com/media/photo-s/0c/6c/aa/4a/photo2jpg.jpg'
  },
  {
    'ingredients': [
      'bacon',
      'cheddar',
      'american cheese',
      'bun',
      'tomato',
      'onion',
      'pickles',
      'lettuce',
      'mayo',
      'ketchup'
    ],
    'tags': [
      'prime'
    ],
    'name': 'Angus burger',
    'description': 'A hamburger made using beef from Angus cattle. The name "Angus burger" is used by several fast-food hamburger chains for one or more "premium" burgers; however, it does not belong to any single company. Pre-made frozen Angus burgers are increasingly available from retailers.',
    'origin': 'United States',
    'rating': 8,
    'imgUrl': 'https://comidasburguer.com/wp-content/uploads/2019/04/burger11.jpg'
  },
  {
    'ingredients': [
      'avacodo',
      'guacamole',
      'bun',
      'tomato',
      'onion',
      'pickles',
      'lettuce',
      'mayo',
      'ketchup'
    ],
    'tags': [
      'healthy',
      'halal',
      'kosher'
    ],
    'name': 'Cali burger',
    'description': 'A classic cheeseburger with avacado or guacamole',
    'origin': 'United States',
    'rating': 8,
    'imgUrl': 'https://assets.kraftfoods.com/recipe_images/opendeploy/55215_640x428.jpg',
  }
];

const burgerToAdd = {
  'ingredients': [
    'avacodo',
    'guacamole',
    'cheese',
    'tomato',
    'onion',
    'pickles',
    'lettuce',
    'mayo',
    'ketchup'
  ],
  'tags': [
    'healthy',
    'halal',
    'kosher'
  ],
  'name': 'Mali burger',
  'description': 'A classic cheeseburger with avacado or guacamole',
  'origin': 'Kyrgyzstan',
  'rating': 2,
  'imgUrl': 'https://assets.kraftfoods.com/recipe_images/opendeploy/55215_640x428.jpg',
};

const BurgersInDb = async () => {
  const burgers = await Burger.find({});
  return burgers.map(burger => burger.toJSON());
};

module.exports = {
  initialBurgers, BurgersInDb, burgerToAdd
};