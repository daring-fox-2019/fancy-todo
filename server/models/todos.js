const mongoose = require('mongoose')

let todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `Title required.`],
  },
  description : {
    type: String
  },
  status : {
    type : String
  },
  dueDate : {
    type : Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checked: Boolean
})

let Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo