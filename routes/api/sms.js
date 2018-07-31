require('dotenv').config()


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);



module.exports = {

  resoTextMsg: function (phone, reso_id) {
    return client.messages.create({
      to: phone,
      from: process.env.FROM_NUMBER,
      body: `Thank you! Your reservation code is ${reso_id} You have been added to the waitlist and we will notify you when your table is ready!`
    })
      .then((message) => console.log("sending sms to " + phone, message.sid))
      .catch(err => { console.log(err) });
  },

  tableReadyMsg:  function () {
    return client.messages.create({
      to: phone,
      from: process.env.FROM_NUMBER,
      body: "Thank you for waiting! Your table is ready!"
    })
      .then((message) => console.log("sending sms to " + phone, message.sid))
      .catch(err => { console.log(err) });
  },
}