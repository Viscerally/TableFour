// count how many clients are connected
const countClients = ws => Object.keys(ws.sockets.connected).length;

// SET UP BROADCAST LOGIC
const broadcastData = (io, socket, emitTo, dataToSend, admins) => {
  // if sender is admin, broadcast message to ALL CLIENTS including the sender
  if (Object.keys(admins).includes(socket.id)) {
    io.emit(emitTo, dataToSend);
  } else {
    // otherwise, first send data to ALL ADMINS
    Object.keys(admins).forEach(adminId => {
      socket.broadcast.to(adminId).emit(emitTo, dataToSend);
    });

    // then, we want the original sender to be redirected to /reservations/:res_code
    // add an extra object called "redirectTo" with res_code
    dataToSend = (emitTo === 'loadNewReservation') && { ...dataToSend, redirectTo: dataToSend.reservation.res_code };
    socket.emit(emitTo, dataToSend);
  }
};

module.exports = { countClients, broadcastData };