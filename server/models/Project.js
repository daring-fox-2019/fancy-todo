const mongoose = require('mongoose');
const User = require('../models/User');
const Todo = require('../models/Todo');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please name your project'],
  },
  description: String,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Cannot be empty'],
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  todos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Todo',
    },
  ],
}, { timestamps: true });

projectSchema.pre('save', function(next) {
  this.members.push(this.ownerId);
  User.update(
    { _id: this.ownerId},
    { $push: { projects: this._id }},
  )
    .exec();
  next();
})

projectSchema.pre('remove', function(next) {
  Todo.remove({ projectId: this._id })
    .exec();
  User.update(
    { _id: this.ownerId },
    { $pull: { projects: this._id } },
  )
    .exec();
  next();
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
