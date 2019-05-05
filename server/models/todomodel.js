const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: {
      type: String,
      default: "notdone"
  },
  dueDate: Date,
});

module.exports = mongoose.model('Todo', todoSchema); // the model