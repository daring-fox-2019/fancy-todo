const { Todo, User } = require('../models')

class ControllerTodo {
  static create(req, res) {
    let { name, description, dueDate } = req.body
    let newTodo = {
      name, description, dueDate,
      userId: req.user._id
    }
    Todo.create(newTodo)
      .then(data => {
        return User.findOneAndUpdate({ _id: req.user._id }, { $push: { todos: data }}, { new: true })
      })
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => res.status(500).json({ message: err.message }))

  }
  static findAll(req, res) {
    Todo.find()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => res.status(500).json({message: err.message}))
  }
  static findOne(req, res) {
    Todo.findOne({_id: req.params.id})
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
  static update(req, res) {
    Todo.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })
    .then(todo => {
      res.status(200).json(todo)
    })
    .catch(err => res.status(500).json({message: err.message}))
  }
  static delete(req, res) {
    User.findOneAndUpdate({ _id: req.user._id }, { $pull : { todos: req.params.id}} ,{ new: true })
      .then(user => {
        return Todo.findOneAndDelete({_id: req.params.id})
      })
      .then(todo => {
        const response = {
          message: 'Successfully deleted todo.',
          id: req.params.id,
        }
        res.status(200).json(response)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
}

module.exports = ControllerTodo