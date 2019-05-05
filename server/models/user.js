const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    firstName : {
        type : String,
        required : [true, 'First Name must be filled']
    },
    lastName : {
        type : String,
        required : [true, 'Last Name must be filled']
    },
    email : {
        type : String,
        validate : [
            {
                validator : function(input) {
                    let regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
                    return regex.test(input)
                },
                message : 'Invalid email format'
                
            },
            {
                validator : function (input) {
                    return User.findOne({email : input, _id : {$ne : this.id}})
                    .then((found) => {if (found != null) return false})
                }, message : 'Email already registered'
            }
        ]
    },
    password : {
        type : String, 
        required : [true, 'Password cannot be empty'],
        minlength : [6, 'Minimum length for password is 6']
    },
    todos : [{
        type : Schema.Types.ObjectId,
        ref : 'Todo'
    }],
    projects : [{
        type : Schema.Types.ObjectId,
        ref : 'Project'
    }]
}, {timestamps : true})

userSchema.post('validate', function(next) {
    let salt = bcrypt.genSaltSync(8)
    this.password = bcrypt.hashSync(this.password, salt)
})

const User = mongoose.model('User', userSchema)
module.exports = User