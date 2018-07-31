const updateReservationStatus = (db, io, status) => {
  db.reservations.save(status)
    .then(result => {
      // take out reservation id and status and broadcast it back to React client
      const { id, status } = result;
      io.emit('newStatus', { id, status });
    })
    .catch(err => {
      console.log(err);
    })
};

module.exports = { updateReservationStatus };