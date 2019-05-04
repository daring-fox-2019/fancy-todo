const User = require('../models/user')
const Todo = require('../models/todo')
const Helper = require('../helpers/helper')
const ObjectId = require('objectid')

class TodoController {
    static list(req, res) {
        Todo.find({})
        .populate('owner', 'email')
        .then(user=> {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    }

    static findOne(req, res) {
        Todo.findOne({
            name: req.params.todoName
        })
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static update(req, res) {
        const todoId = ObjectId(req.params.todoId)

        Todo.findOneAndUpdate(todoId)
        .then(todo => {
            for(let key in req.body) {
                todo[key] = req.body[key]
            }

            todo.save()

            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static delete(req, res) {
        const todoId = ObjectId(req.params.todoId)

        Todo.findByIdAndRemove(todoId)
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

module.exports = TodoController
