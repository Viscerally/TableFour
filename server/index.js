require('dotenv').config();
const bodyParser = require('body-parser');
const socketServ = require('../libs/serv-sock-setters.js');
//PORT for Express Server, Sockets will use the same server and port
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const massive = require('massive');
const connectionString = process.env.DATABASE_URL;

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

massive(connectionString)
  .then(db => {
    console.log('Connection to PSQL established.');
    const apiRoutes = require('../routes/api/index')(db);
    app.use('/api', apiRoutes);

    socketServ.setSocketServer(io, db);
  })
  .catch(err => {
    console.log(err.stack);
  });

server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT} in ${ENV} mode.`);
});
