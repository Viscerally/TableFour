module.exports = {
  getAllReservations() {
    return new Promise((resolve, reject) => {
      fetch('/api/reservations')
        .then(response => response.json())
        .then(reservations => { resolve(reservations) })
        .catch(err => { reject(err.stack) });
    });
  },
  makeReservation(data) {
    return new Promise((resolve, reject) => {
      fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      })
        .then(() => { resolve(); })
        .catch(err => { reject(err.stack) });
    });
  }
};