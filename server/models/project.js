const mongoose = require('mongoose')

let projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Name required.`],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  }]
})

let Project = mongoose.model('Project', projectSchema)

module.exports = Project