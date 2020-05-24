const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const mWare = require('./utils/middleware');
const burgerRouter = require('./routes/burger');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./views/swagger.json');
const PORT = process.env.PORT || 3005;

app.use(helmet());
// to display the api requests in console
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// setting up environment
app.use(cors());
app.use(express.json());
app.set('json spaces', 2);
app.use(compression());

// to disable caching
app.disable('etag');

// connect to mongoDB database
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB server');
  })
  .catch(error => {
    logger.error('Unable to connect to MongoDB '+ error.message);
  });
// check if the server is running
app.get('/ping', (_req, res) => {
  res.send('it is up and running!');
});

// register routers
app.use('/api/burgers', burgerRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup((swaggerDoc)));

// register middlewares
app.use(mWare.unknownEndpoint);
app.use(mWare.errorHandler);

app.listen(PORT, () => {
  console.log(`running at port ${PORT}`);
});

module.exports = app;