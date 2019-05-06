const mongoose = require('mongoose')

let todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Name required.`],
  },
  description: String,
  status: {
    type: Boolean,
    default: false
  },
  dueDate: Date,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  }
})

let Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo