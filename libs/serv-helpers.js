const twilio = require('twilio');
const smsMsg = require('../routes/api/sms.js');
const rs = require('random-strings');

// "DO NOT CHANGE" REFERS TO FUNCTIONS CONFIRMED TO BE WORKING
// GET ALL RESERVATIONS - DO NOT CHANGE
function getAllReservations(db) {
  const qItems = 'reservations.id, email, group_size, name, phone, placement_time, res_code, status';
  const q = `SELECT ${qItems} FROM reservations JOIN customers ON customer_id = customers.id WHERE status = 'waiting' ORDER BY placement_time ASC`;

  return db.query(q)
    .then(data => data)
    .catch(err => { console.log(err); })
}
// GET ALL RESERVATIONS - END

const insertCustmer = (db, customerData) => {
  return db.customers.insert(customerData)
    .then(result => result)
    .catch(err => { console.log(err) })
}

const insertReservation = (db, reservationData) => {
  return db.reservations.insert(reservationData)
    .then(result => result)
    .catch(err => { console.log(err) })
}

// DO NOT CHANGE
const saveCustomer = (db, customerData) => {
  return db.customers.save(customerData)
    .then(result => result)
    .catch(err => { console.log(err) })
}

// DO NOT CHANGE
const saveReservation = (db, reservationData) => {
  return db.reservations.save(reservationData)
    .then(result => result)
    .catch(err => { console.log(err) })
}

// SUBMIT NEW RESERVATION - DO NOT CHANGE
const submitNewReservation = async (db, formData) => {
  const { name, phone, group_size, email, path } = formData;
  const customer = await saveCustomer(db, { name, phone, email });

  const reservationData = {
    placement_time: new Date(),
    status: 'waiting',
    customer_id: customer.id,
    res_code: rs.alphaNumUpper(6),
    group_size
  }
  const reservation = await saveReservation(db, reservationData);
  
  const order = {


  }

  // text the reservation data
  //smsMsg.resoTextMsg(phone, reservation);
  return { customer, reservation, path };
}
// SUBMIT NEW RESERVATION - END

const getReservationByResCode = (db, res_code) => {
  return db.reservations.findOne({ res_code })
    .then(result => result)
    .catch(err => { console.log(err) })
}

const getCustomerByReservation = (db, reso) => {
  return db.customers.findOne({
    'id': reso.customer_id
  })
    .then(result => result)
    .catch(err => { console.log(err) })
}

// DO NOT CHANGE
const findReservation = (db, param) => {
  const paramKey = Object.keys(param)[0];
  return db.reservations.findOne({ [paramKey]: param[paramKey] })
    .then(result => result)
    .catch(err => { console.log(err) })
};

// DO NOT CHANGE
const updateReservation = async (db, formData) => {
  const { name, phone, group_size, email, res_code } = formData;

  // find the reservation record by res_code
  const reservationRecord = await findReservation(db, { res_code });

  const { id, customer_id } = reservationRecord;
  const customerData = { id: customer_id, name, phone, email };
  const customer = await saveCustomer(db, customerData);

  const reservationData = { id, group_size };
  const reservation = await saveReservation(db, reservationData);
  return { customer, reservation };
}
// SUBMIT NEW RESERVATION - END

// CANCEL RESERVATION - DO NOT CHANGE
const cancelReservation = async (db, formData) => {
  const { res_code } = formData;
  const reservationRecord = await findReservation(db, { res_code });
  const { id } = reservationRecord;
  const reservationData = { id, status: 'cancelled' };
  const reservation = await saveReservation(db, reservationData);

  return reservation;
}
// CANCEL RESERVATION - END

// UPDATE RESERVATION STATUS BY ADMIN - DO NOT CHANGE
// read customer data
const readCustomer = (db, customerData) => {
  return db.customers.findOne(customerData)
    .then(result => result)
    .catch(err => { console.log(err); });
};

// DO NOT CHANGE
const updateReservationStatus = async (db, resoStatus) => {
  // find reservation by id
  const reservationData = await findReservation(db, { id: resoStatus.id });

  // read customer data
  customer = await readCustomer(db, { id: reservationData.customer_id });

  // update reservation data
  reservationData.status = resoStatus.status;
  reservation = await saveReservation(db, reservationData);
  return { customer, reservation };
};
// UPDATE RESERVATION STATUS BY ADMIN - END

const getAllMenuItemOrders = db => {
  return db.menu_items_orders.find()
    .then(data => data)
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
    .then(data => data)
    .catch(err => {
      console.log(err);
    })
}

const getMenuItemByItemOrder = (db, menuItemOrder) => {
  return db.menu_items.findOne({
    id: menuItemOrder.menu_item_id
  })
    .then(data => data)
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
    .then(data => data)
    .catch(err => {
      console.log(err);
    })
}

const getMenu = (db) => {
  let allCats;

  return db.categories.find()
  .then(allCategories => {
    allCats = allCategories;
    return db.menu_items.find()
  })
  .then(allMenuItems => {
    // console.log(allCats[0]);
    const processedMenu = processMenu(allCats, allMenuItems);
    return processedMenu;
  })
  .catch(err => {
    console.log(err)
  })
}

const processMenu = function(categories, menuItems){
  const menu = {};
  for (category of categories){    
    menu[category.id] = category;   
  }
  for (menuItem of menuItems){ 
    if (!menu[menuItem.category_id].menuItems){
      menu[menuItem.category_id].menuItems = [];
    }
    menu[menuItem.category_id].menuItems.push(menuItem);
  }
  return menu;
}

const removeOrderItem = (db, orderItem) => {
  return db.menu_items_orders.destroy(
    {id: orderItem.id},
    (err, res) => {
      return res;
    })
}


module.exports = {
  getAllReservations,
  submitNewReservation,
  updateReservation,
  cancelReservation,
  updateReservationStatus,
  getAllMenuItemOrders,
  getItemOrdersWMenuItemInfo,
  getMenuItemByItemOrder,
  addItemOrderWMenuItem,
  addItemToOrder,
  getReservationByResCode,
  getCustomerByReservation,
  getMenu,
  removeOrderItem
}
