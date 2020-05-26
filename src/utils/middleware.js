const rateLimit = require('express-rate-limit');

const unknownEndpoint = (request, response) => {
  response.status(404).send('404 Not Found');
};

const errorHandler = (error, request, response, next) => {
  if(error.name === 'CastError' || error.name === 'ObjectId'){
    return response.status(400).send('Internal server error');
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).send('Incorrect input');
  }
  next(error);
};

const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: 'You have exceeded the 100 requests in 24 hrs limit!',
  headers: true,
});

module.exports = {
  unknownEndpoint,
  errorHandler,
  rateLimiter
};