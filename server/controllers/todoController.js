const Todo = require('../models/todoModel')

class TodoController {

    static create (req, res) {
        Todo
            .create(req.body)
            .then((data) => {
                res.status(201).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static showAll (req, res) {
        Todo
            .find({
                userId : req.headers.id
            })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static showOne( req, res) {
        Todo
            .findById(req.params.id)
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static update (req, res) {
        console.log(req.body);
        
        Todo
            .findByIdAndUpdate(req.params.id, req.body)
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err)=> {
                res.status(500).json(err)
            })
    }

    static delete (req, res) {
        Todo
            .deleteOne({
                _id : req.params.id
            })
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }
}

module.exports = TodoController