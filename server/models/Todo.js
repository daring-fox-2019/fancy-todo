const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Todo name cannot be empty'],
  },
  description: String,
  status: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

todoSchema.pre('save', function(next) {
  User.update(
    { _id: this.userId },
    { $push: { todos: this._id } },
  )
    .exec();
  next();
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
