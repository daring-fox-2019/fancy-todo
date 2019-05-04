const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: {
    type:String,
    required: [true, 'Email cannot be empty'],
    validate: {
      validator(email) {
        return /.+@.+\..+/ig.test(email);
      },
      message: 'Not a valid email format'
    }
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty']
  },
  projectID: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
  todosID: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Todo',
    },
  ],
}, { timestamps: true });

userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, 8);
  next();
});

userSchema.path('email').validate(function (email) {
  return User.findOne({ email })
    .then((user) => {
      if (user){
        return false;
      } else {
        return true;
      }
    });
}, 'Email is already in use') ;

const User = mongoose.model('User', userSchema);

module.exports= User;