const Helper = require('../helper/helper'
)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name : {
        type : String,
        required : [true]
    },
    email : {
        type : String,
        required : [true]
    },
    password : {
        type : String,
        required : [true]
    },
    project_list: {
        type : [{type : Schema.Types.ObjectId, ref: 'Project'}]
    }
})

UserSchema.path('email').validate( function(){
    return User.findOne({email : this.email})
    .then( data => {
        if(data){
            return Promise.resolve(false)
        } else {
            return Promise.resolve(true)
        }
    })
}, `email already in use`)

UserSchema.path('email').validate(function(value){
    return /\w{4,}\@\w{3,}\.\w{2,}/.test(value)
}, 'email must valid format')

UserSchema.pre('save', function(next){
    this.password = Helper.generateHashPass(this.password)
    next()
})

UserSchema.pre('findOneAndUpdate', function(next) {
    if(this.password){
        this.password = Helper.generateHashPass(this.password)
    } 
    next()
})



const User = mongoose.model('User', UserSchema)

module.exports = User