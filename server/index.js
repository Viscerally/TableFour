// dotenv package
require('dotenv').config();

// require express and app
const express = require('express');
const app = express();

// require massive js
const massive = require('massive');

// include the api router
const apiRoutes = require('../routes/api/index');

// constants
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

const connectionString = process.env.DATABASE_URL;
app.use(express.static(__dirname + '/build'));
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${ENV} mode.`);
});
/*massive(connectionString)
  .then(massiveInstance => {
    console.log('Connection to PSQL established.')

    // set up middleware
    // all static files are in /bundle

    // set up /api path for all api routes


    app.set('db', massiveInstance);
    const db = app.get('db');



  })
  .catch(err => {
    console.log(err.stack);
  })*/
