// count how many clients are connected
const countClients = ws => Object.keys(ws.sockets.connected).length;

// SET UP BROADCAST LOGIC
const broadcastResos = (io, socket, emitTo, dataToSend, admins, sendToAll) => {
  // https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
  if (sendToAll) {
    // BROADCAST MESSAGE TO EVERYBODY
    // IF AN ADMIN SUBMITTED A RESERVATION, REMOVE res_code. OTHERWISE,
    // THIS WILL CHANGE THE FORM BUTTONS ON BOTH ADMIN & CUSTOMER PAGES
    if (Object.keys(admins).includes(socket.id)) {
      dataToSend.reservation.res_code = '';
    }
    io.emit(emitTo, dataToSend);
  } else {
    // FIRST, SEND RESERVATION BACK TO THE ORIGINAL SENDER
    socket.emit(emitTo, dataToSend);

    // NEXT, SEND THE SAME DATASET TO ALL ADMINS BUT AFTER CHANGING RES_CODE TO ''
    // OTHERWISE SUBMIT BUTTON DISAPPEARS AND UPDATE AND CANCEL BUTTONS SHOW UP (NOT GOOD)
    dataToSend.reservation.res_code = '';
    // original sender & admins get full data back
    Object.keys(admins).forEach(adminId => {
      socket.broadcast.to(adminId).emit(emitTo, dataToSend);
    });
  }
};

module.exports = { countClients, broadcastResos };