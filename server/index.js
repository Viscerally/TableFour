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

app.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
})

app.get('/callback', (req, res) => {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: { code, redirect_uri, grant_type: 'authorization_code' },
    headers: {
      'Authorization': 'Basic ' + (
        new Buffer(`${client_id}:${client_secret}`).toString('base64')
      )
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || `http://localhost:3000`
    res.redirect(uri + '?access_token=' + access_token)
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${ENV} mode.`);
});