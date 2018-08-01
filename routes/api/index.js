const express = require('express');
const apiRouter = express.Router();

module.exports = function (db) {

  // initial loading of all reservation records
  apiRouter.get('/reservations', (req, res) => {
    // query string
    const qItems = 'reservations.id, email, group_size, name, phone, placement_time, res_code, order_id, status';
    const q = `SELECT ${qItems} FROM reservations JOIN customers ON customer_id = customers.id WHERE status = 'waiting' ORDER BY placement_time ASC`;

    db.query(q)
      .then(result => {
        res.status(200).json(result);
      })
      .then(err => {
        // res.status(500).send({ error: 'Error while retrieving all reservation data' });
        // console.log(err.stack);
      })
  })

  apiRouter.post('/reservations/:res_id', (req, res) => {
    res.send('Cancel a reservation.');
  })
  apiRouter.patch('/reservations', (req, res) => {
    res.send('Patch me up!');
  })
  apiRouter.get('/reservations/:res_id/orders', (req, res) => {
    res.send('All orders associated with a reservation');
  })
  apiRouter.patch('/reservations/:res_id/orders/:order_id', (req, res) => {
    res.send('Update the order');
  })
  apiRouter.get('/categories/:cat_id/menu_items', (req, res) => {
    res.send('Return a list of all menu items associated with a category');
  })
  apiRouter.get('/orders/:order_id/menu_items', (req, res) => {
    let qStr =
      `SELECT menu_items_orders.id, img_url, menu_item_id, order_id, name, description, price, category_id
      FROM menu_items_orders
      INNER JOIN menu_items
      ON menu_items_orders.menu_item_id = menu_items.id WHERE order_id = 2`;

    db.query(qStr)
      .then(result => {
        console.log(result[5]);
        res.status(200).json(result);
      })
      .then(err => {
        res.status(500).send({ error: 'Error while retrieving order menu item data' });
        console.log(err.stack);
      })
  })

  // NOTE: should be extracted into separate route
  apiRouter.post('/orders/:order_id', (req, res) => {
    db.menu_items_orders.insert({
      menu_item_id: req.body.id,
      order_id: req.params.order_id
    })
      // .then((menuItemOrder) => {
      //res.json(menuItemOrder);
      //})
      .then((newReference) => {
        return db.menu_items.findOne(newReference.menu_item_id);
      })
      .then((menu_item) => {
        // returns the new menu item
        res.status(200).json(menu_item);
      });
  });

  apiRouter.get('/orders/:order_id/menu_items_orders', (req, res) => {
    db.menu_items_orders.find({
      order_id: req.params.order_id
    })
      .then((menuItemOrders) => {
        res.json(menuItemOrders);

      })
  })

  apiRouter.get('/menu_items', (req, res) => {
    db.menu_items.find()
      .then((menu_items) => {
        res.status(200).json(menu_items);
      })
  });
  apiRouter.get('/menu_items/:item_id', (req, res) => {
    db.menu_items.findOne(req.params.item_id)
      .then((menu_item) => {
        res.status(200).json(menu_item);
      });
  })

  ///////////route for sms functionality/////////
  apiRouter.get('/customers/:cust_id', (req, res) => {
    db.customers.find(req.params.cust_id)
      .then((cust) => {
        res.status(200).json(cust);
      })
  })

  // console.log('test');

  // get the massiveJS instance saved in app object
  // console.log(db);
  return apiRouter;

};
