const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const app = require('./app');
const PORT = process.env.PORT || 3005;

// connect to mongoDB database
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB server');
  })
  .catch(error => {
    logger.error('Can not to connect to MongoDB '+ error.message);
  });
// run server
app.listen(PORT, () => {
  console.log(`running at port ${PORT}`);
});

module.exports = app;