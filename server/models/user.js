const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {hash} = require('../helpers/bcrypt')
const userSchema = new Schema({
    email: {
        type: String,
        validate: [{
            validator(email) {
                return User.findOne({
                    email:email
                })
                .then(found => {
                    if(found) return false;
                })
            },
            message: 'email is registered'
        }, {
            validator(email) {
                const emailRegex = /\S+@\S+\.\S+/
                return emailRegex.test(email)
            }
        }]
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    name: String,
    picture: String,
});

userSchema.pre('save', function(next) {
    this.password = hash(this.password)
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User;