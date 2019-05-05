const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Name required.`],
  },
  email: String,
  password: String,
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
    default: []
  }]
})

let User = mongoose.model('User', userSchema)

User.schema.path('email').validate(function (input) {
  User.findOne({email: input})
    .then(found => {
      if(found) {
        return false
      } else {
        return true
      }
    })
    .catch(err => {console.log(err)})
}, 'Email has been used.')

module.exports = User