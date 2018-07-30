// dotenv package
require('dotenv').config();

// require express and app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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

app.get('/', function (req, res) {
  console.log('getting hit in index.js');
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

io.on('connection', function(socket){
  socket.emit('news', {hello: 'world'});

})

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
