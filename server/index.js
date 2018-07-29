// dotenv package
require('dotenv').config();


// constants
const PORT = process.env.PORT || 3002;
const ENV = process.env.NODE_ENV || 'development';
const connectionString = process.env.DATABASE_URL;

// require express and app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// require massive JS
const massive = require('massive');
// set up socket server
// reference:
// https://stackoverflow.com/questions/44710051/socket-io-with-express-emit-not-working-within-express-route
const server = require('http').Server(app);
const io = require('socket.io')(server);

// set up middleware
// all static files are in /bundle
app.use(express.static(__dirname + '/build'));
// enable body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const countClients = ws => Object.keys(ws.sockets.connected).length;

io.on('connection', socket => {
  console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
  socket.on('disconnect', () => {
    console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
  })
});
// express server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT} in ${ENV} mode.`);
});
// http server
server.listen(3001, () => {
  console.log('HTTP server running on 3001');
});


// connect to PSQL using massive js
massive(connectionString)
  .then(massiveInstance => {
    console.log('Connection to PSQL established.');

    // include the api router
    const apiRoutes = require('../routes/api/index')(massiveInstance, io);
    // set up /api path for all api routes
    app.use('/api', apiRoutes);
  })
  .catch(err => {
    console.log(err.stack);
  });