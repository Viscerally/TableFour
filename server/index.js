// dotenv package
require('dotenv').config();

// require express and app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path')

server.listen(3001);

const handleDisconnection = () => {
  console.log('CLIENT DISCONNECTED');
}

io.on('connection', client => {
  client.on('disconnect', handleDisconnection);


  console.log(io.engine.clientsCount);
  // socket.emit('news', { hello: 'world' });
})
// app.get('/', function (req, res) {
//   console.log('getting hit in index.js');
//   res.sendFile(path.join(__dirname, '../client/index.html'));
// });


// require massive js
const massive = require('massive');

// constants
const PORT = process.env.PORT || 3002;
const ENV = process.env.NODE_ENV || 'development';

const connectionString = process.env.DATABASE_URL;

massive(connectionString)
  .then(massiveInstance => {
    console.log('Connection to PSQL established.');
    // save the massive instance in app object
    app.set('db', massiveInstance);
    const db = app.get('db');

    // set up middleware
    // all static files are in /bundle
    app.use(express.static(__dirname + '/build'));
    // enable body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // include the api router
    const apiRoutes = require('../routes/api/index')(db);
    // set up /api path for all api routes
    app.use('/api', apiRoutes);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} in ${ENV} mode.`);
    });
  })
  .catch(err => {
    console.log(err.stack);
  })
