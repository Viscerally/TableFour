require('dotenv').config();
const bodyParser = require('body-parser');

//PORT for Express Server, Sockets will use the same server and port
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const massive = require('massive');
const connectionString = process.env.DATABASE_URL;
const countClients = Object.keys(io.sockets.connected).length;

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on('connection', socket => {
  console.log(`${countClients} CLIENT(S) CONNECTED`);
  socket.on('join', (data) => {
    socket.emit('messages', 'Hello world from server');
  })
  socket.on('disconnect', () => {
    console.log(`${countClients} CLIENT(S) CONNECTED`);
  })
});

massive(connectionString)
  .then(massiveInstance => {
    console.log('Connection to PSQL established.');
    const apiRoutes = require('../routes/api/index')(massiveInstance, io);
    app.use('/api', apiRoutes);
  })
  .catch(err => {
    console.log(err.stack);
  });

server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT} in ${ENV} mode.`);
});
