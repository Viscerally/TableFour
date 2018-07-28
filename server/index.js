// dotenv package
require('dotenv').config();

// require express and app
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path')


server.listen(3001);

app.get('/', function (req, res) {
  console.log('getting hit in index.js');
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

io.on('connection', function(socket){
  socket.emit('news', {hello: 'world'});

})

// require massive js
const massive = require('massive');

// include the api router
const apiRoutes = require('../routes/api/index');

// constants
const PORT = process.env.PORT || 3002;
const ENV = process.env.NODE_ENV || 'development';

const connectionString = process.env.DATABASE_URL;
app.use(express.static(__dirname + '/build'));

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

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} in ${ENV} mode.`);
    });

  })
  .catch(err => {
    console.log(err.stack);
  })
