const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: 'ongoing'
  },
  dueDate: Date,
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Todo = mongoose.model('todo', todoSchema)

module.exports = Todo
