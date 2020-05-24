const mongoose = require('mongoose');

mongoose.set('useFindAndModify', true);

const BurgerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  description: {
    type: String,
    min_length: 20,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  ingredients: [
    {
      type: String
    }
  ],
  tags: [
    {
      type: String
    }
  ],
  imgUrl: {
    type: String
  }
});

BurgerSchema.index({ name: 'text' });

class BurgerClass {

  static async list({ offset, limit, burger_name, tag_name, origin_name, rating, ingredient }) {
    // conditionally creates properties of the query object
    const query = {
      ...(burger_name && { $text: { $search: burger_name } }),
      ...(tag_name && { tags: { $in : [`${tag_name}`] } }),
      ...(origin_name && { origin: origin_name }),
      ...(rating) && { rating: { $gt: rating-1 } },
      ...(ingredient) && { ingredients: { $in: [`${ingredient}`] } }
    };
    const burgers = await this.find(query)
      .sort({ rating: -1 })
      .skip((offset-1) * 10)
      .limit(limit);
    return burgers;
  }

  static async addBurger(burger){
    return this.create({
      name: burger.name,
      description: burger.description,
      origin: burger.origin,
      rating: burger.rating,
      imgUrl: burger.imgUrl,
      ingredients: burger.ingredients,
      tags: burger.tags
    });
  }
}

BurgerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

BurgerSchema.loadClass(BurgerClass);
const Burger = mongoose.model('Burger', BurgerSchema);

module.exports = Burger;