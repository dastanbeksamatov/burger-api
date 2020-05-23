const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
const config = require('./utils/config');
const logger = require('./utils/logger');
const mWare = require('./utils/middleware');
const burgerRouter = require('./routes/BurgerRoute');
const app = express();
const PORT = 3005;

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.json());
// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.set('json spaces', 2);


// to disable caching
app.disable('etag');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB server');
  })
  .catch(error => {
    logger.error('Unable to connect to MongoDB '+ error.message);
  });

app.get('/ping', (_req, res) => {
  res.send('it is up and running!');
});

app.use('/burgers', burgerRouter);

app.use(mWare.errorHandler);
app.use(mWare.unknownEndpoint);

app.listen(PORT, () => {
  console.log(`running at port ${PORT}`);
});