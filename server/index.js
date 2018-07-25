require('dotenv').config()
const express = require('express');
const app = express();
const querystring = require('querystring');

const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';
const redirect_uri = process.env.REDIRECT_URI || `https//localhost:${PORT}/callback`

app.use(express.static(__dirname + '/build'));

app.get('/api', (req, res) => {
  res.json({});
});

app.get('/login', (req, res) => {
  res.send('login');
  // res.redirect('https://accounts.spotify.com/authorize?' +
  //   querystring.stringify({
  //     response_type: 'code',
  //     client_id: process.env.SPOTIFY_CLIENT_ID,
  //     scope: 'user-read-private user-read-email',
  //     redirect_uri
  //   }))
})

// app.get('/callback', (req, res) => {
//   let code = req.query.code || null
//   let authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri,
//       grant_type: 'authorization_code'
//     },
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer(
//         process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
//       ).toString('base64'))
//     },
//     json: true
//   }
//   request.post(authOptions, function (error, response, body) {
//     var access_token = body.access_token
//     let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
//     res.redirect(uri + '?access_token=' + access_token)
//   })
// })


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${ENV} mode.`);
});