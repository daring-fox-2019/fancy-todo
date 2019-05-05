const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/fancy-todos',{ useNewUrlParser: true } );

let todoSchema = new Schema({
    title : String,
    description: String,
    UserId : String,
    dueDate: Date,
    status: false,
    urgency: false
})

let Todo = mongoose.model('todo',todoSchema)

module.exports = Todo