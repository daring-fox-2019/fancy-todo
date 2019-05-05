const Todo = require('../models/todos')
const User = require('../models/users')

class TodoControllers {
  static create(req, res) {
    let input = req.body
    let newTodo = {
      title: input.title,
      description: input.description,
      status : input.status,
      dueDate : input.dueDate,
      userId: req.user.id,
      checked: false
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
      .populate('userId', 'name')
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => res.status(500).json({message: err.message}))
  }
  static findOne(req, res) {
    Todo.findOne({_id: req.params.id})
      .populate('userId', 'name')
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
  static update(req, res) {
    req.body.checked = (req.body.checked === 'true' || req.body.checked === true) ? true : false
    Todo.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => res.status(500).json({message: err.message}))
  }
  static delete(req, res) {
    User.findOneAndUpdate({ _id: req.user._id }, { $pull : { todos: req.params.id}} ,{ new: true })
      .then(user => {
        // console.log({user})
        return Todo.findOneAndDelete({_id: req.params.id})
      })
      .then(todo => {
        // console.log({reqUserId: req.user._id, todoId: todo._id})
        const response = {
          message: 'Successfully deleted todo.',
          id: req.params.id,
        }
        res.status(200).json(response)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
}

module.exports = TodoControllers