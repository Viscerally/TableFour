const express = require('express');
const apiRouter = express.Router();

apiRouter.get('/reservations', (req, res) => {
  res.send('Return all reservations');
})
apiRouter.post('/reservations', (req, res) => {
  res.send('Create new reservation in DB.');
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
apiRouter.get('/categories/:cat_id/menu_items', (req,res) => {
  res.send('Return a list of all menu items associated with a category');
})

module.exports = apiRouter;
