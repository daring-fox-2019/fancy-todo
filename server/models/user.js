const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypt = require('../helpers/crypt');

const userSchema = new Schema({
  email: {
    type: String,
    required: [ true, 'Email is required' ],
    validate: [{
      validator: function(value) {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          throw 'Invalid email format'
        }
      },
    },
    {
      validator: function(value) {
        return User.find({
              _id: { $ne: this._id },
              email: value
           })
          .then( data => {
              if(data.length !== 0) {
                  throw 'Email has already been used. Try another one.';
              }
          })
          .catch(err => {
              throw err;
          });
      }
    }]
  },
  password: {
    type: String,
    required: [ true, 'Password is required' ]
  },
  name: {
    type: String,
    default: 'default_name'
  },
  role: {
    type: String,
    default: 'user'
  },
  
})

userSchema.pre('save', function(next) {
  this.password = crypt.hashPassword(this.password);
  next()
})

let User = mongoose.model('User', userSchema);

module.exports = User
