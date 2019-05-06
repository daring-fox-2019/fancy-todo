const Todo         = require('../models/todo');
const { ObjectId } = require('mongoose').Types;

class TodoController {
    static todoList(req, res) {

        Todo
            .find({
                owner: req.authenticatedUser._id
            })
            .then(todos => {
                res
                    .status(200)
                    .json(todos)
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    }


    static addTodo(req, res) {
        
        Todo
            .create({
                ...req.body,
                owner: req.authenticatedUser._id
            })
            .then(newTodo => {
                res
                    .status(201)
                    .json(newTodo)
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    }

    static deleteTodo(req, res) {
        Todo
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                if (result.n && result.ok) {
                    res
                        .status(200)
                        .json({
                            message: 'Todo deleted'
                        });
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Todo not found'
                        })
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    });
            })
    }

    static updateTodo(req, res) {
        Todo
            .updateOne(
                { _id: ObjectId(req.params.id)}, 
                { $set: req.body }
            )
            .then(result => {
                if (result.n && result.ok) {
                    res
                        .status(200)
                        .json({
                            message: 'Todo updated'
                        });
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Todo not found'
                        })
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    });
            })
    }
}

module.exports = TodoController;
