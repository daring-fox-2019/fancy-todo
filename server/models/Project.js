const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
  title: String,
  description: String,
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  membersId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  todosId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'todo'
  }]
})

const Project = mongoose.model('project', projectSchema)

module.exports = Project
