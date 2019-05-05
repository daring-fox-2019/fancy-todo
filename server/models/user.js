const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)
const { Schema } = mongoose;
const Helper = require('../helpers/helper')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [4, 'Name min 4']
    },
    email: {
        type: String,
        required: true,
        validate: [
            // {
                // validator: function (email) {
                //     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                //     return emailRegex.test(email.text)
                // },
                // message: props => `Email tidak sesuai format`
            // },
            {
                validator: function (email) {
                    return new Promise(function (resolve, reject) {
                        User.findOne({
                                email
                            })
                            .then(data => {
                                if (data === null) {
                                    resolve(true)
                                } else {
                                    resolve(false)
                                }
                            })
                            .catch(err => {
                                reject(err)
                            })
                    });
                },
                message: props => `${props.value} sudah terdaftar`
            }
        ]
    },
    password: {
        type: String,
        minlength: [4, 'Password min 4']
    }
});

userSchema.pre('save', function(next, done) {
    this.password = Helper.hashPassword(this.password)
    next()
});

const User = mongoose.model('User', userSchema);

module.exports = User