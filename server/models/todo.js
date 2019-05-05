const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required",]
  },
  dueDate: Date,
  status: {
    type: String,
    default: "In Progress",
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: "User",
  },
  isInProject: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;