const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./views/swagger.json');
const morgan = require('morgan');
const cors = require('cors');
const burgerRouter = require('./routes');
const mWare = require('./utils/middleware');
const app = express();

app.use(helmet());
app.use(mWare.rateLimiter);
// to log the api requests in console
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// enabling cors, response in json, and indentation of json
app.use(cors());
app.use(express.json());
app.set('json spaces', 2);
app.use(compression());

// disable caching
app.disable('etag');

app.get('/ping', (_req, res) => {
  res.send('it is up and running!');
});

// register routers
app.use('/api/burgers', burgerRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup((swaggerDoc)));

// register middlewares
app.use(mWare.unknownEndpoint);
app.use(mWare.errorHandler);

module.exports = app;