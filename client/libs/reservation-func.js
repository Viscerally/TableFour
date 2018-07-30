// check if res_code already exists
const reservationExist = (reservations, res_code) => {
  // check if the new res_code exists in the state reservation data
  const booleanArray = reservations.map(reservation => reservation.res_code === res_code);
  // check if there is any "true" in the array. if so, this means customer's trying to
  // UPDATE data rather than adding new data
  return booleanArray.some(el => el === true);
};

const returnResoArray = (reservations, newReservation) => {
  const { res_code } = newReservation;

  if (reservationExist(reservations, res_code)) {
    // CASE 1: updating existing data
    return reservations.map(reservation => {
      if (reservation.res_code === res_code) {
        return newReservation;
      } else {
        return reservation;
      }
    });
  } else {
    // CASE 2: adding new reservation data
    return [...reservations, newReservation];
  }
};

const getAllReservations = () => {
  return new Promise((resolve, reject) => {
    fetch('/api/reservations')
      .then(response => response.json())
      .then(reservations => { resolve(reservations) })
      .catch(err => { reject(err.stack) });
  });
};

module.exports = { getAllReservations, returnResoArray };