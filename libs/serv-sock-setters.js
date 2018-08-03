const serv = require('./serv-helpers.js');
const { countClients } = require('./socket-helpers.js');

// create empty objects to store socket client id and url
// from which requests were made. save admin data in a separate object
const clients = {}, admin = {};

module.exports = function setSocketServer(io, db) {
  // HANDLE SOCKET CONNECTION
  return io.on('connection', socket => {
    console.log(`${countClients(io)} CLIENT(S) CONNECTED`);

    // HANDLE SOCKET DISCONNECTION
    socket.on('disconnect', () => {
      console.log(`${countClients(io)} CLIENT(S) CONNECTED`);
    });

    // deconstruct socket object and save id and path (referer without origin)
    const { id, request: { headers: { origin, referer } } } = socket;
    const path = referer.replace(origin, '');
    // if client is admin, save id and path to "admin"
    if (path === '/admin') {
      admin[id] = { id, path };
    } else {
      // otherwise save it to "clients"
      clients[id] = { id, path };
    }

    // LOAD INITIAL RESERVATIONS
    socket.on('getReservations', () => {
      serv.getAllReservations(db)
        .then(data => { io.emit('loadReservations', data); })
        .catch(err => console.log(err));
    })

    socket.on('getReservationByResCode', data => {
      serv.getReservationByResCode(db, data)
        .then(data => { io.emit('loadReservation', data); })
        .catch(err => { console.log(err) });
    })

    socket.on('getCustomerByResCode', data => {
      serv.getReservationByResCode(db, data)
        .then(reso => {
          return serv.getCustomerByReservation(db, reso)
        })
        .then(custo => {
          io.emit('loadCustomer', custo)
        })
        .catch(err => { console.log(err) });
    })

    /// GET MENU
    socket.on('getMenu', () => {
      serv.getMenu(db)
        .then(menu => {
          //Specify which socket if necessary
          io.emit('returnedMenu', menu);
        })
        .catch(err => { console.log(err) });
    })

    //GET MENU ITEMS BY CATEGORY
    // socket.on('submitReservation', formData => {
    //   console.log('Server socket handling submit');
    //   serv.submitNewReservation(db, formData)
    //     .then(data => { io.emit('loadNewReservation', data); })
    //     .catch(err => {console.log(err)});
    // })


    // SUBMIT NEW RESERVATION
    socket.on('submitReservation', formData => {
      serv.submitNewReservation(db, formData)
        .then(data => {
          // if sender is admin, broadcast message to all clients including the sender
          if (Object.keys(admin).includes(socket.id)) {
            io.emit('loadNewReservation', data);
          } else {
            // otherwise, broadcast message to the original sender and admin(s)
            socket.emit('loadNewReservation', data);
            Object.keys(admin).forEach(adminId => {
              socket.broadcast.to(adminId).emit('loadNewReservation', data);
            })
          }
        })
        .catch(err => { console.log(err) });
    })

    // UPDATE EXISTING RESERVATION
    socket.on('updateReservation', formData => {
      serv.updateReservation(db, formData)
        .then(data => {
          // if sender is admin, broadcast message to all clients including the sender
          if (Object.keys(admin).includes(socket.id)) {
            io.emit('loadChangedReservation', data);
          } else {
            // otherwise, broadcast message to the original sender and admin(s)
            socket.emit('loadChangedReservation', data);
            Object.keys(admin).forEach(adminId => {
              socket.broadcast.to(adminId).emit('loadChangedReservation', data);
            })
          }
        })
        .catch(err => console.log(err));
    });

    // CANCEL RESERVATION
    socket.on('cancelReservation', formData => {
      serv.cancelReservation(db, formData)
        .then(data => {
          // if sender is admin, broadcast message to all clients including the sender
          if (Object.keys(admin).includes(socket.id)) {
            io.emit('removeCancelledReservation', data);
          } else {
            // otherwise, broadcast message to the original sender and admin(s)
            socket.emit('removeCancelledReservation', data);
            Object.keys(admin).forEach(adminId => {
              socket.broadcast.to(adminId).emit('removeCancelledReservation', data);
            })
          }
        });
    })

    // UPDATE RESERVATION STATUS BY ADMIN
    socket.on('updateReservationStatus', status => {
      serv.updateReservationStatus(db, status)
        .then(data => { io.emit('changeReservationStatus', data); });
    })

    socket.on('getAllMenuItemOrders', status => {
      serv.getAllMenuItemOrders(db)
        .then(data => { io.emit('AllMenuItemOrders', data); })
        .catch(err => console.log(err));
    })

    socket.on('getItemOrdersWMenuItemInfo', status => {
      serv.getItemOrdersWMenuItemInfo(db)
        .then(data => { io.emit('ItemOrdersWMenuItemInfo', data); })
        .catch(err => console.log(err));
    })

    socket.on('removeOrderItem', orderItem => {
      serv.removeOrderItem(db, orderItem)
        .then(deletedOrderItem => {
          io.emit('deletedOrderItem', deletedOrderItem);
        })
    })

    socket.on('addItemToOrder', status => {

      serv.addItemOrderWMenuItem(db, status)
        .then(data => { io.emit('newOrderAdded', data); })
        .catch(err => console.log(err));
    })
  })
};