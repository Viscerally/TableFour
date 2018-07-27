// dotenv package
require('dotenv').config();

// require express and app
const express = require('express');
const app = express();

// require massive js
const massive = require('massive');

// include the api router
const apiRoutes = require('../routes/api');

// constants
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

const connectionString = process.env.DATABASE_URL;

massive(connectionString)
  .then(massiveInstance => {
    console.log('Connection to PSQL established.')

    // set up middleware
    // all static files are in /bundle
    app.use(express.static(__dirname + '/build'));
    // set up /api path for all api routes
    app.use('/api', apiRoutes);

    app.set('db', massiveInstance);
    const db = app.get('db');

    // massive js example
    // var newUser = {
    //   email: "test@test.com",
    //   first: "Joe",
    //   last: "Test"
    // };
    // db.users.save(newUser, function (err, result) {
    //   console.log(result);
    // });


    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} in ${ENV} mode.`);
    });
  })
  .catch(err => {
    console.log(err.stack);
  })
