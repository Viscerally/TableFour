require('dotenv').config()


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);



module.exports = {

  resoTextMsg: function (phone, reservation) {
    const {reso_id, host} = reservation;
    const url = `${host}/home/reservations/${reso_id}`
    return client.messages.create({
      to: phone,
      from: process.env.FROM_NUMBER,
      body: `Thank you! Your reservation code is ${reso_id}. Please visit ${url} to view your place in line. You can even order ahead to ensure your food is prepared quicker! We will notify you when your table is ready!`
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