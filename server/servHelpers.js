function getAllReservations(db){
  return db.reservations.find()
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err);
    })
}

function getAllMenuItemOrders(db){
  return db.menu_items_orders.find()
  .then(data => {
    return data;
  })
  .catch(err => {
    console.log(err)
  })
}

function getMenuItemsByItemOrders(db){
  let qStr =
    `SELECT menu_items_orders.id, order_id, img_url, menu_item_id, name, description, price, category_id
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

module.exports = {
  getAllReservations: getAllReservations,
  getAllMenuItemOrders: getAllMenuItemOrders,
  getMenuItemsByItemOrders: getMenuItemsByItemOrders,
  getMenuItemByItemOrder: getMenuItemByItemOrder,
  addItemToOrder: addItemToOrder,
  addItemOrderWMenuItem: addItemOrderWMenuItem
}
