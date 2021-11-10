require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
// const session = require('./config/session.config');  Metodo Cookie........
const auth = require('./middleware/auth.middleware');


const app = express()
const port = process.env.PORT

require('./config/db.config');
app.use(logger("dev"));
app.use(express.json());
// app.use(session);  Metodo Cookie........

app.use(auth.loadUser);

const routes = require('./config/routes.config');
app.use('/api', routes);

app.use((req, res, next) => {
  next(createError(404, 'Route Not Found'))
})

app.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    error = createError(400, error);
  } else if (error instanceof mongoose.Error.CastError && error.message.includes('_id')) {
    error = createError(404, 'Resource Not Found');
  } else if (!error.status) {
    error = createError(500, error);
  }

  if (error.status >= 500) {
    console.error(error);
  }

  const data = {};
  data.message = error.message;

  if (error.errors) {
    data.errors = Object.keys(error.errors)
      .reduce((errors, key) => {
        errors[key] = error.errors[key].message;
        return errors;
      }, {});
  }
  res.status(error.status).json(data);
});

app.listen(port, () => {
  console.log(`PosterApp listening at http://localhost:${port}`)
})

module.exports = app;