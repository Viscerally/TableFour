const express = require('express');
const apiRouter = express.Router();
const rs = require('random-strings');

module.exports = function (db, io) {

  // initial loading of all reservation records
  apiRouter.get('/reservations', (req, res) => {
    // query string
    const qItems = 'reservations.id, email, group_size, name, phone, placement_time, res_code, order_id, status';
    const q = `SELECT ${qItems} FROM reservations JOIN customers ON customer_id = customers.id ORDER BY placement_time ASC`;

    db.query(q)
      .then(result => {
        res.status(200).json(result);
      })
      .then(err => {
        // res.status(500).send({ error: 'Error while retrieving all reservation data' });
        // console.log(err.stack);
      })
  })

  apiRouter.post('/reservations', (req, res) => {
    // deconstruct req.body object
    const { name, phone, group_size, email, res_code } = req.body;

    if (res_code) {
      // CASE 1: reservation exists. update existing customer info
      // res_code !== null
      db.reservations.find({ res_code }).then(reservation => {
        const { id, customer_id } = reservation[0];

        // update the customer info
        db.customers.save({ id: customer_id, name, phone, email })
          .then(customer => {
            // update the group_size in reservations table
            db.reservations.save({ id, group_size })
              .then(reservation => {
                io.emit('news', { customer, reservation });
              })
              .catch(err => { console.log(err) });
          })
          .catch(err => { console.log(err); });
      })
    } else {
      // CASE 2: new reservation.
      // res_code === null
      // compile all customer data
      const customerData = {
        // capitalise the first letter of name
        name: name.replace(/^\w/, chr => chr.toUpperCase()),
        phone,
        email
      };
      // save customerData into customers tb
      db.customers.save(customerData)
        .then(customer => {
          // create an object representing reservation data
          const resoData = {
            placement_time: new Date(),
            status: 'waiting',
            customer_id: customer.id,
            res_code: rs.alphaNumUpper(6),
            group_size
          };
          // save reservation data
          db.reservations.save(resoData)
            .then(reservation => {
              io.emit('news', { customer, reservation });
            })
            .catch(err => {
              // res.status(500).send({ error: 'Error while retrieving reservation data' });
              // console.log(err.stack);
            })
        })
        .catch(err => {
          // res.status(500).send({ error: 'Error while retrieving customer data' });
          // console.log(err.stack);
        });
    }



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
      ON menu_items_orders.menu_item_id = menu_items.id WHERE order_id = 1`;
    
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
  
  apiRouter.post('/orders/:order_id', (req, res) => {
    console.log(req.body);
    db.menu_items_orders.insert({
      menu_item_id: req.body.id,
      order_id: req.params.order_id
    })
      .then((menuItemOrder) => {
        res.json(menuItemOrder);
      })
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
      })
  })

  return apiRouter;

}
