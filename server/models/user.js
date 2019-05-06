const mongoose    = require('mongoose');
const { Schema }  = mongoose;
const { encrypt } = require('../helpers/bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required']
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (email) {
                return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)
            },
            message: `Email is not a valid`
        },
        required: [true, 'User email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
})

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email has been taken'));
    } else {
        next();
    }
})

userSchema.pre('save', function (next) {
    this.password = encrypt(this.password);
    next();
})

let User = mongoose.model('User', userSchema);

module.exports = User