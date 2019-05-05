require('dotenv').config()

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORDEMAIL,
  }
});

function sendMail(to, text) {
  let mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: 'New Project Invitation',
    text
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);

    } else {
      console.log(info.response);

    }
  })
}

module.exports = sendMail