require('dotenv').config();

// constants
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'development';
const connectionString = process.env.DATABASE_URL;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const massive = require('massive');
// set up socket server
// reference:
// https://stackoverflow.com/questions/44710051/socket-io-with-express-emit-not-working-within-express-route
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path')
const twilio = require('twilio');
const accountSid = 'ACab21b463584e0d1a9af1c53bf426d50d'; // Your Account SID from www.twilio.com/console
const authToken = 'your_auth_token';   // Your Auth Token from www.twilio.com/console
const client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+12345678901',  // Text this number
    from: '+12345678901' // From a valid Twilio number
})
.then((message) => console.log(message.sid));




server.listen(3001);

app.use(express.static(__dirname + '/build'));
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
