const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
      type: String,
      required: [true, 'Must have any name']
  },
  description: {
      type: String,
  },
  owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  pending: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  todos: [{
      type: Schema.Types.ObjectId,
      ref: 'Todo'
  }]
})


let Project = mongoose.model('Project', projectSchema);

module.exports = Project
