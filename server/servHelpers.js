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

function getItemOrdersWMenuItemInfo(db){
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

function addItemToOrder(db, menuItemOrder){
  db.menu_items_orders.insert({
    menu_item_id: menuItemOrder.menuItemId,
    order_id: menuItemOrder.order_id
  })
  .then((data) => {
    return data;
  })
  .catch(err => {
    console.log(err);
  })
}

module.exports = {
  getAllReservations: getAllReservations,
  getAllMenuItemOrders: getAllMenuItemOrders,
  getItemOrdersWMenuItemInfo: getItemOrdersWMenuItemInfo
}
