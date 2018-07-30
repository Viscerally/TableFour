require('dotenv').config()


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);



console.log("sending sms to", process.env.TO_NUMBER);

client.messages.create({
  to: process.env.TO_NUMBER,
  from: process.env.FROM_NUMBER,
  body: "Get those tables ready!"
})
.then((message) => console.log(message.sid))
.catch(err => {console.log(err)});


