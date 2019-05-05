const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator')
let userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    name : {type: String, required: true},
    email: {
        type: String, 
        required: true,
        unique: true,
        validate: [{
            validator: function(email){
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
            },
            message: "Email must be in email format!"
        }]
    },
    password: {type: String, required: true, select: false}
    // todos: [{type:mongoose.Schema.Types.ObjectId, ref: "Todo"}]
})
userSchema.plugin(uniqueValidator)
userSchema.methods ={
    encryptPassword: function(plainPassword){
        let salt = bcrypt.genSaltSync(8)
        return bcrypt.hashSync(plainPassword,salt)
    }
}
userSchema.pre('save', function(next){
    if(this.isModified('password')){
        this.password = this.encryptPassword(this.password)
    }
    next()
})


let User = mongoose.model('User', userSchema)

module.exports = User