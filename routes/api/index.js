const express = require('express');
const apiRouter = express.Router();

module.exports = function (db) {
  apiRouter.get('/reservations', (req, res) => {
    // create a query string
    const q = "SELECT * FROM reservations JOIN customers ON customer_id = customers.id" +
    " WHERE placement_time >=NOW()::DATE + INTERVAL '1h' ORDER BY placement_time desc";

    db.query(q)
      .then(result => {
        res.status(200).send(result);
      })
      .then(err => {
        res.status(500).send({ error: 'Error while retrieving all reservation data' });
        console.log(err.stack);
      })
  })
  apiRouter.post('/reservations', (req, res) => {
    // get the form data
    const formData = req.body;
    // deconstruct req.body object
    const { name, phone, group_size, email } = req.body;

    // compile all customer data
    const customerData = {
      // capitalise the first letter of name
      name: name.replace(/^\w/, chr => chr.toUpperCase()),
      phone,
      email
    };
    console.log(customerData);
    // save customerData into customers tb
    db.customers.save(customerData)
      .then(customer => {

        // create an object representing reservation data
        const resoData = {
          placement_time: new Date(),
          status: 'waiting',
          customer_id: customer.id,
          group_size
        };
        // save reservation data
        db.reservations.save(resoData)
          .then(reservation => {
            // return customer and reservation json
            res.status(200).json({ customer, reservation });
          })
          .catch(err => {
            res.status(500).send({ error: 'Error while retrieving reservation data' });
            console.log(err.stack);
          })

      })
      .catch(err => {
        res.status(500).send({ error: 'Error while retrieving customer data' });
        console.log(err.stack);
      });

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


  // get the massiveJS instance saved in app object
  // console.log(db);
  return apiRouter;
}