const User = require('../models/user')
const Todo = require('../models/todos')

function updateUserTodo(id, field, value) {
    return User.updateUserToDo(id, field, value)
}

module.exports = {
    showOneToDo: function (req, res) {
        let id = req.params.id
        Todo.findOne(id)
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })
    },
    showAllToDo: function (req, res) {
        Todo.findAll(req.userId)
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })
    },
    addToDo: function (req, res) {
        let todo = req.body.todo
        let start = new Date(req.body.start.toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta'
        })).toLocaleString()
        let end = new Date(req.body.end.toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta'
        })).toLocaleString()
        let description = req.body.description
        let location = req.body.location
        let status = req.body.status
        let user = req.userId
        Todo.create(
                todo, start, end, description, location, status, req.userId
            )
            .then((data) => {
                updateUserTodo(user, 'todos', data._id)
                    .then(function (data) {
                        res.status(201).json(data)
                    })
            })
            .catch(function (err) {
                res.status(400).json(`${err.message}`)
            })


    },
    updateToDo: function (req, res) {
        let todo = req.body.todo
        let start = new Date(req.body.start.toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta'
        })).toLocaleString()
        let end = new Date(req.body.end.toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta'
        })).toLocaleString()
        console.log(start, 'opopopol', req.body.start)
        let description = req.body.description
        let location = req.body.location
        let status = req.body.status
        let id = req.params.id
        Todo.update(id, todo, start, end, description, location, status)
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })

    },
    deleteToDo: function (req, res) {
        let id = req.params.id
        Todo.delete(id)
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })
    }
}