const { Project, Todo, User } = require('../models')

class ControllerProject {
  static create(req, res) {
    let { name } = req.body
    let newProject = {
      name,
      owner: req.user._id
    }
    Project.create(newProject)
      .then(data => {
        if(req.body.user == undefined) {
          return Project.findOneAndUpdate({ _id: data._id }, { $addToSet: { members : req.user._id }}, { new: true })
        } else {
          return Project.findOneAndUpdate({ _id: data._id }, { $addToSet: { members: { $each: [ req.user._id, req.body.user ]} }}, { new: true })
        }
      })
      .then(project => {
        res.status(201).json({ project })
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static findAll(req, res) {
    Project.find()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => res.status(500).json({message: err.message}))
  }
  static findOne(req, res) {
    Project.findOne({_id: req.params.projectId})
      .populate('members', 'name')
      .populate('todos')
      .then(project => {
        res.status(200).json(project)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
  static findMyProject(req, res) {
    Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id}]})
      .populate('members', 'name')
      .populate('todos')
      .then(projects => { res.status(200).json(projects) })
      .catch(err => res.status(500).json(err))
  }
  static update(req, res) {
    Project.findOneAndUpdate({_id: req.params.projectId}, req.body, { new: true })
    .then(project => {
      res.status(200).json(project)
    })
    .catch(err => res.status(500).json({message: err.message}))
  }
  static editMembers(req, res) {
    let { projectId, userId } = req.params
    if(req.body.method === 'add') {
      Project.findOneAndUpdate({ _id: projectId }, { $addToSet: { members : userId }}, { new: true })
      .then(project => {
        res.status(200).json(project)
      })
      .catch(err => { res.status(500).json(err) })
    } else if(req.body.method === 'remove') {
      Project.findOneAndUpdate({ _id: projectId }, { $pull: { members : userId }}, { new: true })
      .then(project => {
        res.status(200).json(project)
      })
      .catch(err => { res.status(500).json(err) })
    } else {
      res.status(400).json({error: 'Invalid project method'})
    }
  }
  static delete(req, res) {
    Project.findOneAndDelete({_id: req.params.projectId})
      .then(project => {
        const response = {
          message: 'Successfully deleted project.',
          id: req.params.projectId
        }
        res.status(200).json(response)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
  static createTodo(req,res) {
    let { name, description, dueDate } = req.body
    let { projectId } = req.params
    let todoId
    Todo.create({
      name, description, dueDate,
      userId: req.user._id,
      projectId
    })
      .then(todo => {
        todoId = todo._id
        return Promise.all([
          User.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { todos: todo._id }}, { new: true }),
          Project.findOneAndUpdate({ _id: projectId }, { $addToSet: { todos: todo._id }}, { new: true })
        ])
      })
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => { console.log({err}); res.status(500).json(err)})
  }
}

module.exports = ControllerProject