const express = require('express');
const apiRouter = express.Router();

const getLocations = (req, res) => {
  res.sendFile(process.cwd() + '/data/locations.json');
};

module.exports = apiRouter.get('/locations', getLocations);