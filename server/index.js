require('dotenv').config();

// constants
//const connectionString = process.env.DATABASE_URL;
// const bodyParser = require('body-parser');
// const massive = require('massive');
// app.use(express.static(__dirname + '/build'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// const countClients = ws => Object.keys(ws.sockets.connected).length;
// console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
// console.log(`${countClients(io)} CLIENT(S) CONNECTED`);

// connect to PSQL using massive js
/*
massive(connectionString)
  .then(massiveInstance => {
    console.log('Connection to PSQL established.');
    //const apiRoutes = require('../routes/api/index')(massiveInstance, io);
    //app.use('/api', apiRoutes);
  })
  .catch(err => {
    console.log(err.stack);
  });
*/

//PORT for Express Server, Sockets will use the same server and port
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('join', (data) => {    
    socket.emit('messages', 'Hello world from server');
  })
  socket.on('disconnect', () => {

  })
});

server.listen(3001);
