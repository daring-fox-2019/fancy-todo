const Todo = require('../models/todo')

class TodoController {
    static find(req, res) {
        let regKey = new RegExp(req.query.q, 'i');

        if(req.query.q || req.query.q !== '') {
            Todo.find()
            .or([{ 'title': { $regex: regKey }}, { 'description': { $regex: regKey }}])
            .exec()
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                res.status(500).json(err);
            })
        }
        else {
            Todo.find()
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                res.status(500).json(err);
            })
        }
    }

    static findOne(req, res) {
        let id = req.params.id

        Todo.find({_id: id})
            .then(todo => {
                res.status(200).json(todo)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static create(req, res) {
        let todo = {
            title: req.body.title,
            description: req.body.description,
            dueDate: new Date(req.body.dueDate),
            owner: req.user._id,
            status: 'open'
        }

        Todo.create(todo)
            .then(created => {
                res.status(201).json(created)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static update(req, res) {
        let updated = {}
        for(let key of Object.keys(req.body)) {
            updated[key] = req.body[key]
        }

        Todo.findOneAndUpdate({_id: req.params.id}, updated, {new: true})
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static delete(req, res) {
        Todo.findOneAndDelete({_id: req.params.id})
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }
}

module.exports = TodoController