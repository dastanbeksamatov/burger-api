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

module.exports = {
  unknownEndpoint,
  errorHandler
};