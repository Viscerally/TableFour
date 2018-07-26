// dotenv package
require('dotenv').config();

// require express and app
const express = require('express');
const app = express();

const querystring = require('querystring');
const request = require('request');

// include the api router
const apiRoutes = require('../routes/api');

// constants
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';
const redirect_uri = process.env.REDIRECT_URI || `http://localhost:${PORT}/callback`
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// set up middleware
// all static files are in /bundle
app.use(express.static(__dirname + '/build'));
// set up /api path for all api routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${ENV} mode.`);
});