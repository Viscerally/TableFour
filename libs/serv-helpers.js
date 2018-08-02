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

const insertCustomer = (db, customerData) => {
  return db.customers.insert(customerData)
    .then(result => {
      return result
    })
    .catch(err => { console.log(err) })
}

const insertReservation = (db, reservationData) => {
  return db.reservations.insert(reservationData)
    .then(result => { return result })
    .catch(err => { console.log(err) })
}

const submitNewReservation = async (db, formData) => {
  const { name, phone, group_size, email } = formData;
  const customer = await insertCustomer(db, { name, phone, email });

  const reservationData = {
    placement_time: new Date(),
    status: 'waiting',
    customer_id: customer.id,
    res_code: rs.alphaNumUpper(6),
    group_size
  }
  const reservation = await insertReservation(db, reservationData);
  //reservation.host = formData.host;

  //
  // TODO: INSERT AN ORDER RECORD HERE!
  //

  // text the reservation data
  //smsMsg.resoTextMsg(phone, reservation);
  return { customer, reservation };
}

const findReservation = (db, param) => {
  const paramKey = Object.keys(param)[0];
  return db.reservations.findOne({ [paramKey]: param.res_code })
    .then(result => { return result })
    .catch(err => { console.log(err) })
};

const updateReservation = (db, formData) => {
  console.log('UPDATE: ', formData);
  //TODO UPDATE THE RESERVATION DATA
  db.reservations.update({id: formData.resId}, {}, result =>{
    return result;
  })
    .then(result => {

    })
  const customer = saveCustomer(db, customerData);
  const reservation = insertReservation(db, reservationData);

  return { ...customer, ...reservation };
}

const cancelReservation = (db, formData) => {
  const { res_code } = formData;
  return db.reservations.findOne({
      'res_code': res_code
    })
    .then(reso => {
      return db.reservations.update(
        {id: reso.id},
        {status: 'cancelled'},
        (err, resp) => {
          return resp;
        }
      )
    })
    .then(reso => {
      return reso;
    })
    .catch(err => {
      console.log(err);
    })

}

const getAllMenuItemOrders = db => {
  return db.menu_items_orders.find()
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
    })
}

const getItemOrdersWMenuItemInfo = db => {
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

const getMenuItemByItemOrder = (db, menuItemOrder) => {
  return db.menu_items.findOne({
    id: menuItemOrder.menu_item_id
  })
  .then(data => {
    return data;
  })
}

const addItemOrderWMenuItem = (db, menuItemOrder) => {
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

const addItemToOrder = (db, menuItemOrder) => {
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
