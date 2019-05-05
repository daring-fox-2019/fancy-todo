const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProjectTodoSchema = new Schema(
  {
    name: String,
    projectId: {type: 'ObjectId', ref: 'Project'}, // populate // gaharus
    created_by: {type: 'ObjectId', ref: 'User'}, // populate // kalo bikin pake req.user._id
    description: String,
    status: {type : String, default : false},
    dueDate: Date
  })

const ProjectTodo = mongoose.model('ProjectTodo', ProjectTodoSchema)

module.exports = ProjectTodo

