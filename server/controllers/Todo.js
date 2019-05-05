const TodoModel = require('../models/Todo')
const ProjectModel = require('../models/Project')

class Todo {
  static findAll (req, res) {
    TodoModel
      .find({ authorId: req.user._id })
      .then(todos => res.status(200).json({ todos }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static findById (req, res) {
    res.status(200).json({ todo: req.todo })
  }

  static create (req, res) {
    TodoModel
      .create({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        authorId: req.user._id
      })
      .then(todo => res.status(201).json({ todo }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static update (req, res) {
    let todo = req.todo

    todo.title = req.body.title
    todo.description = req.body.description
    todo.status = req.body.status
    todo.dueDate = req.body.dueDate
    todo.save()
      .then(todo => res.status(200).json({ todo }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static delete (req, res) {
    req.todo
      .delete()
      .then(todo => {
        ProjectModel
          .find()
          .then(projects => {
            projects.forEach(project => {
              project.todosId.pull(todo._id)
              project.save()
            })
          })
        res.status(200).json({
          todo: {
            _id: todo._id
          }
        })
      })
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }
}

module.exports = Todo
