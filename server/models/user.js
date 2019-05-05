const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email must required'],
      unique: true,
      validate: [{
          validator: function validateEmail(email) {
              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(String(email).toLowerCase());
          },
          message: 'Email not valid'
      }, {
          validator: function uniqueEmail(inputEmail) {
              return new Promise((resolve, reject) => {
                  this.model('User').findOne({
                          email: inputEmail
                      })
                      .then(function(result) {
                          if (result) {
                              throw new Error('Email already exists')
                          } else {
                              resolve()
                          }
                      })
                      .catch(function(err) {
                          reject(err.message)
                      })
              })
          }
      }]
  },
  password: {
      type: String,
      minlength: [3, 'Minimal 3 digits'],
      required: true
  },
    projects: [{ type: 'ObjectId', ref: 'Project'}] // populate
  })

const User = mongoose.model('User', UserSchema)

module.exports = User

