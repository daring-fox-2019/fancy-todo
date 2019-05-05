const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    password: String
});

userSchema.pre('save', function(next) {
    let user = this
    var salt = bcrypt.genSaltSync(9)
    var hash = bcrypt.hashSync(user.password, salt)
    user.password = hash
    next();
});

userSchema.methods.comparePassword = function(inputPassword, callback) {
    bcrypt.compare(inputPassword, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema); // the model