const serv = require('./serv-helpers.js');

function setSocketServer(io, db){
  const countClients = ws => Object.keys(ws.sockets.connected).length;
  return io.on('connection', socket => {
    console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
    socket.on('disconnect', () => {
      console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
    });

    // LOAD INITIAL RESERVATIONS
    socket.on('getReservations', () => {
      serv.getAllReservations(db)
        .then(data => { io.emit('loadReservations', data); })
    })

    // SUBMIT NEW RESERVATION
    socket.on('submitReservation', formData => {
      serv.submitNewReservation(db, formData)
        .then(data => { io.emit('loadNewReservation', data); });
    })

    // UPDATE EXISTING RESERVATION
    socket.on('updateReservation', formData => {
      serv.updateReservation(db, formData)
        .then(data => { io.emit('loadChangedReservation', data); });
    });

    // CANCEL RESERVATION
    socket.on('cancelReservation', formData => {
      serv.cancelReservation(db, formData)
        .then(data => { io.emit('removeCancelledReservation', data); });
    })


    socket.on('getAllMenuItemOrders', status => {
      serv.getAllMenuItemOrders(db)
        .then(data => {
          io.emit('AllMenuItemOrders', data);
        })
    })
    socket.on('getItemOrdersWMenuItemInfo', status => {
      console.log('Message received!');
      serv.getItemOrdersWMenuItemInfo(db)
        .then(data => {
          io.emit('ItemOrdersWMenuItemInfo', data);
        })
    })
    socket.on('addItemToOrder', status => {
      serv.addItemOrderWMenuItem(db, status)
      .then(data => {
        io.emit('newOrderAdded', data);
      })
    })
  })
}

module.exports = {
  setSocketServer
}
