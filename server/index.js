require('dotenv').config();
const bodyParser = require('body-parser');
const { updateFormData, submitNewFormData } = require('../libs/reservation-func.js');

//PORT for Express Server, Sockets will use the same server and port
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path')
const twilio = require('twilio');
const smsMsg = require('../routes/api/sms.js');


const massive = require('massive');
const connectionString = process.env.DATABASE_URL;
const countClients = ws => Object.keys(ws.sockets.connected).length;

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



massive(connectionString)
  .then(db => {
    console.log('Connection to PSQL established.');
    const apiRoutes = require('../routes/api/index')(db);
    app.use('/api', apiRoutes);

    io.on('connection', socket => {
      console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
      socket.on('disconnect', () => {
        console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
      });

      socket.on('updateReservation', formReservation => {
        updateFormData(db, io, formReservation);
      })

      socket.on('addReservation', formReservation => {
        submitNewFormData(db, io, formReservation);
        db.reservations.findOne().then((reservation) =>{
          console.log('res code is this: ', reservation); 
          smsMsg.resoTextMsg(formReservation.phone, reservation.res_code); 
        }); 
      })
    });
  })
  .catch(err => {
    console.log(err.stack);
  });

server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT} in ${ENV} mode.`);
});
