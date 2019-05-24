const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true } );
// console.log('======',process.env.DB_URL);

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