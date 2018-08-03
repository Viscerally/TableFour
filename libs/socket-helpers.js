// count how many clients are connected
const countClients = ws => Object.keys(ws.sockets.connected).length;

// SET UP BROADCAST LOGIC
const broadcastData = (socket, emitTo, dataToSend, admins, clients) => {
  // https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
  // original sender & admins get full data back
  Object.keys(admins).forEach(adminId => {
    socket.broadcast.to(adminId).emit(emitTo, dataToSend);
  });
  socket.emit(emitTo, dataToSend);

  // everybody else get everything EXCEPT name & res_code
  dataToSend.customer.name = '...';
  dataToSend.reservation.res_code = 'masked';
  Object.keys(clients).forEach(clientId => {
    if (clientId !== socket.id) {
      socket.broadcast.to(clientId).emit(emitTo, dataToSend);
    }
  });
};

module.exports = { countClients, broadcastData };