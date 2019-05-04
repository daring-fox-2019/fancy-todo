const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const todoSchema = new Schema({
  title: {
      type: String,
      required: [true, 'Must have any title']
  },
  description: {
      type: String,
  },
  status: {
      type: String,
      default: 'open'
  },
  dueDate: {
      type: Date,
      default: new Date()
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
})

Todo.prototype.formattedDate = function() {
    return moment().format();
}

let Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo
