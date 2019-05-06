const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    description:{
        type:String,
        required:[true,'the field is required']
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Todo = mongoose.model('Todo',todoSchema)
module.exports = Todo