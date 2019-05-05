const todo = require('../models/todo')
const project = require('../models/project')

class Todo {
  static create(req, res) {
    let newTodo = new todo({
      name: req.body.name,
      description: req.body.description,
      status: false,
      due_date: req.body.due_date,
      userId: req.userId
    })
    todo.create(newTodo)
      .then(dataTodo => {
        return project.update({
          _id: req.body.projectId
        },{
          $push: {
            todos : dataTodo._id
          }
        })
      })
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json({ message: "create task failed", err: err })
      })
  }

  static findAll(req, res) {
    todo.find()
      .populate("userId")
      .then(data => {
        res.status(200).json({ message: "get task data success", data: data })
        // else res.status(404).json({message:"task data not found",data:data})
      })
      .catch(err => {
        res.status(500).json({ message: "get task data failed", err: err })
      })
  }

  static findOne(req, res) {
    todo.findById(req.params.id)
      .populate("userId")
      .then(data => {
        if (data) res.status(200).json({ message: "get task data success", data })
        else res.status(404).json({ message: "task data not found", data })
      })
      .catch(err => {
        res.status(500).json({ message: "get task data failed", err: err })
      })
  }

  static update(req, res) {
    let updateTodo = {
      name: req.body.name,
      description: req.body.description,
      due_date: req.body.due_date,
    }
    todo.findByIdAndUpdate(req.params.id, updateTodo, { new: true })
      .then(data => {
        res.status(200).json({ message: "Update Success", data })
      })
      .catch(err => {
        res.status(500).json({ message: "update task failed", err: err })
      })
  }

  static changeStatus(req, res) {
    todo.findOneAndUpdate({ _id: req.params.id }, { status: true }, { new: true })
      .then(data => {
        res.status(200).json({ message: "Update Success", data })
      })
      .catch(err => {
        res.status(500).json({ message: "get task data failed", err: err })
      })
  }

  static delete(req, res) {
    project.update({
      _id: req.body.projectId
      },{
        $pull: {
          todos : req.params.id
        }
      })
      .then(data => {
        return todo.deleteOne({ _id: req.params.id })
      })
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json({ message: "delete task failed", err: err })
      })
  }
}

module.exports = Todo