const twilio = require('twilio');
const smsMsg = require('../routes/api/sms.js');
const rs = require('random-strings');

function getAllReservations(db) {
  const qItems = 'reservations.id, email, group_size, name, phone, placement_time, res_code, order_id, status';
  const q = `SELECT ${qItems} FROM reservations JOIN customers ON customer_id = customers.id WHERE status = 'waiting' ORDER BY placement_time ASC`;
  return db.query(q)
    .then(data => {
      return data;
    })
    .catch(err => { console.log(err); })
}

const saveCustomer = (db, customerData) => {
  return new Promise((resolve, reject) => {
    db.customers.save(customerData)
      .then(result => { resolve(result); })
      .catch(err => { reject(err); })
  });
};

const saveReservation = (db, reservationData) => {
  return new Promise((resolve, reject) => {
    db.reservations.save(reservationData)
      .then(result => { resolve(result); })
      .catch(err => { reject(err); })
  })
};

const submitNewReservation = async (db, formData) => {
  const { name, phone, group_size, email } = formData;
  const customer = await saveCustomer(db, { name, phone, email });

  const reservationData = {
    placement_time: new Date(),
    status: 'waiting',
    customer_id: customer.id,
    res_code: rs.alphaNumUpper(6),
    group_size
  }
  const reservation = await saveReservation(db, reservationData);
  reservation.host = formData.host;

  // text the reservation data
  smsMsg.resoTextMsg(phone, reservation);
  return { ...customer, ...reservation };
}

const findReservation = (db, param) => {
  const paramKey = Object.keys(param)[0];
  return new Promise((resolve, reject) => {
    db.reservations.find({ [paramKey]: param.res_code })
      .then(result => { resolve(result); })
      .catch(err => { reject(err); })
  });
};

const updateReservation = async (db, formData) => {
  const { name, phone, group_size, email, res_code } = formData;
  const reservationRecord = await findReservation(db, { res_code });

  const { id, customer_id } = reservationRecord[0];
  const customerData = { id: customer_id, name, phone, email };
  const customer = await saveCustomer(db, customerData);

  const reservationData = { id, group_size };
  const reservation = await saveReservation(db, reservationData);

  return { ...customer, ...reservation };
}

const cancelReservation = async (db, formData) => {
  const { res_code } = formData;
  const reservationRecord = await findReservation(db, { res_code });
  const { id } = reservationRecord[0];
  const reservationData = { id, status: 'cancelled' };
  const reservation = await saveReservation(db, reservationData);

  return reservation;
}

function getAllMenuItemOrders(db) {
  return db.menu_items_orders.find()
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
    })
}

function getItemOrdersWMenuItemInfo(db) {
  let qStr =
    `SELECT menu_items_orders.id, img_url, menu_item_id, order_id, name, description, price, category_id
    FROM menu_items_orders
    INNER JOIN menu_items
    ON menu_items_orders.menu_item_id = menu_items.id`;

  return db.query(qStr)
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err);
    })
}

function getMenuItemByItemOrder(db, menuItemOrder){
  return db.menu_items.findOne({
    id: menuItemOrder.menu_item_id
  })
  .then(data => {
    return data;
  })
}

function addItemOrderWMenuItem(db, menuItemOrder){
  let itemOrderWMenuItem = {}

  return addItemToOrder(db, menuItemOrder)
    .then(newOrder => {
      itemOrderWMenuItem.id = newOrder.id;
      itemOrderWMenuItem.order_id = newOrder.order_id;
      return getMenuItemByItemOrder(db, newOrder)
    })
    .then(menuItem => {
      itemOrderWMenuItem.img_url = menuItem.img_url;
      itemOrderWMenuItem.menu_item_id = menuItem.id;
      itemOrderWMenuItem.name = menuItem.name;
      itemOrderWMenuItem.description = menuItem.description;
      itemOrderWMenuItem.price = menuItem.price;
      itemOrderWMenuItem.category_id = menuItem.category_id;
      return itemOrderWMenuItem;
    })
    .catch(err => {
      console.log(err);
    })
}

function addItemToOrder(db, menuItemOrder){
  return db.menu_items_orders.insert({
    menu_item_id: menuItemOrder.id,
    order_id: menuItemOrder.orderId
  })
  .then(data => {
    return data;
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports = {
  getAllReservations,
  submitNewReservation,
  updateReservation,
  cancelReservation,
  getAllMenuItemOrders,
  getItemOrdersWMenuItemInfo,
  getMenuItemByItemOrder,
  addItemOrderWMenuItem,
  addItemToOrder
}
