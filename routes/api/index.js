const express = require('express');
const apiRouter = express.Router();

apiRouter.get('/new', function (req, res) {
  res.send('Welcome');
});

module.exports = apiRouter;
