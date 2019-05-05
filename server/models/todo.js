const mongoose = require('mongoose')
const Schema = mongoose.Schema

let todoSchema = new Schema({
    name: String,
    description: String,
    status: Boolean,
    due_date: Date,
    userId: {type: Schema.Types.ObjectId, ref:"User"},
    project: Boolean
})

let Todo = mongoose.model("Todo", todoSchema)

module.exports = Todo