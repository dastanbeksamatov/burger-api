const express = require('express');
const burgerRouter = express.Router();
const burger = require('./BurgerRoute');

burgerRouter.route('').post(burger.addBurger);

burgerRouter.route('').get(burger.getBurgers);

burgerRouter.route('/:id').get(burger.getById);
module.exports = burgerRouter;