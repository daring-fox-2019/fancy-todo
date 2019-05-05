const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'password length min 5 characters']
    },
    todos: [{
        type: Schema.Types.ObjectId, ref: 'ToDo'
    }]
})

let User = mongoose.model('User', userSchema)

module.exports = {
    User,
    create: function (name, email, password) {
        return User.create({
            name,
            email,
            password
        })
    },
    findOne: function (email) {
        return User.findOne({
            email: email
        })
    },
    updateUserToDo: function(id,field,value){
        return User.updateOne({_id:id},{$push:{[field]:value}})
    }
}