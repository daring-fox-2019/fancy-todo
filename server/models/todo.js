const mongoose = require('mongoose')

const Schema = mongoose.Schema

let todos = new Schema({
    userName : {
        type: String,
        required : true
    },
    todo : {
       type: String,
       required: true
    }
})

let Todo = mongoose.model('Todo', todos)

module.exports = Todo