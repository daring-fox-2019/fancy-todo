const ProjectModel = require('../models/Project')
const UserModel = require('../models/User')
const TodoModel = require('../models/Todo')

class Project {
  static findAll (req, res) {
    ProjectModel
      .find({
        managerId: req.user._id
      })
      .then(projects => res.status(200).json({ projects }))
      .catch(() => req.status(500).json({ message: 'Internal Server Error' }))
  }

  static create (req, res) {
    ProjectModel
      .create({
        title: req.body.title,
        description: req.body.description,
        managerId: req.user._id
      })
      .then(project => res.status(201).json({ project }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static findById (req, res) {
    res.status(200).json({ project: req.project })
  }

  static update (req, res) {
    let project = req.project

    project.title = req.body.title
    project.description = req.body.description
    project.managerId = req.body.managerId
    project.membersId = req.body.membersId
    project.todosId = req.body.todosId
    project.save()
      .then(project => res.status(200).json({ project }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static delete (req, res) {
    req.project
      .delete()
      .then(project => res.status(200).json({
        project: {
          _id: project._id
        }
      }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static addMember (req, res) {
    UserModel
      .findById(req.body.userId)
      .then(user => {
        if (user) {
          if (!req.project.membersId.includes(user._id)) {
            req.project.membersId.push(user._id)
            return req.project.save()
          } else {
            return req.project
          }
        } else {
          return undefined
        }
      })
      .then(project => {
        if (project) res.status(200).json({ project })
        else res.status(404).message({ message: 'User Not Found' })
      })
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static leaveProject (req, res) {
    req.project.membersId.pull(req.user._id)
    req.project
      .save()
      .then(project => res.status(200).json({ project }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static removeMember (req, res) {
    req.project.membersId.pull(req.params.member_id)
    req.project
      .save()
      .then(project => res.status(200).json({ project }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static addTodo (req, res) {
    TodoModel
      .findOne({
        _id: req.body.todoId,
        authorId: req.user._id
      })
      .then(todo => {
        if (todo) {
          if (!req.project.todosId.includes(todo._id)) {
            req.project.todosId.push(todo._id)
            return req.project.save()
          } else {
            return req.project
          }
        } else {
          return undefined
        }
      })
      .then(project => {
        if (project) res.status(200).json({ project })
        else res.status(404).json({ message: 'Todo Not Found' })
      })
      .catch(() => res.status(500).json({ mesage: 'Internal Server Error' }))
  }

  static removeTodo (req, res) {
    req.project.todosId.pull(req.params.todo_id)
    req.project
      .save()
      .then(project => res.status(200).json({ project }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }
}

module.exports = Project
