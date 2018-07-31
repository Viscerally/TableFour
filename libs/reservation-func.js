const twilio = require('twilio');
const smsMsg = require('../routes/api/sms.js');
const rs = require('random-strings');

// save customer data
const saveCustomer = (db, customerData) => {
  return new Promise((resolve, reject) => {
    db.customers.save(customerData)
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      })
  });
};

// save reservation data
const saveReservation = (db, reservationData) => {
  return new Promise((resolve, reject) => {
    db.reservations.save(reservationData)
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      })
  })
};

// find reservation data
const findReservation = (db, param) => {
  const paramKey = Object.keys(param)[0];
  console.log(param, Object.keys(param));
  return new Promise((resolve, reject) => {
    db.reservations.find({ [paramKey]: param.res_code })
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      })
  });
};

// submit new reservation form
const submitNewFormData = async (db, io, formData) => {
  const { name, phone, group_size, email } = formData;

  const customerData = {
    // capitalise the first letter of name
    name: name.replace(/^\w/, chr => chr.toUpperCase()),
    phone,
    email
  };
  const customer = await saveCustomer(db, customerData);
  const reservationData = {
    placement_time: new Date(),
    status: 'waiting',
    customer_id: customer.id,
    res_code: rs.alphaNumUpper(6),
    group_size
  }
  const reservation = await saveReservation(db, reservationData);
  reservation.host = formData.host;

  smsMsg.resoTextMsg(phone, reservation);
  io.emit('news', { customer, reservation });
};

// update existing reservation data
const updateFormData = async (db, io, formData) => {
  const { name, phone, group_size, email, res_code } = formData;

  const reservationRecord = await findReservation(db, { res_code: res_code });
  const { id, customer_id } = reservationRecord[0];
  const customerData = {
    id: customer_id,
    name,
    phone,
    email
  };
  const customer = await saveCustomer(db, customerData);
  const reservationData = { id, group_size };
  const reservation = await saveReservation(db, reservationData);

  io.emit('news', { customer, reservation });
}

module.exports = { updateFormData, submitNewFormData };