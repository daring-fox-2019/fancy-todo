"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: 'mprasetiodc.official@gmail.com', 
      pass: process.env.GOOGLE_EMAIL_PASS 
    }
});

const mailOptions = {
  from: 'mprasetiodc.official@gmail.com',
  to: '',
  subject: "Your register success!",
  html: 'Hello, welcome to the club!'
}

module.exports = {mailOptions, transporter}
