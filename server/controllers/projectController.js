const Project = require('../models/project')
const Todo = require('../models/todo')

class ProjectController {
    static findAll(req, res) {
        Project.find()
            .populate('todos')
            .populate('members')
            .then(list => {
                res.status(200).json(list)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static findOne(req, res) {
        let id = req.params.id

        Project
            .find({_id: id})
            .populate('todos')
            .populate('members')
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static create(req, res) {
        let project = {
            name: req.body.name,
            description: req.body.description,
            owner: req.user._id
        }

        Project.create(project)
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

        Project
            .findOneAndUpdate({_id: req.params.id}, updated, {new: true})
            .populate('todos')
            .populate('members')
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static delete(req, res) {
        Project.findOneAndDelete({_id: req.params.id})
            .populate('todos')
            .populate('members')
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }
 
    static addMember(req, res) {
        let newMemberID = req.body.id

        Project.findOneAndUpdate({_id: req.params.id}, {$push: {members: newMemberID}}, {new: true})
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static removeMember(req, res) {
        let deletedMemberID = req.body.id

        Project.findOneAndUpdate(
            {_id: req.params.id},
            { $pull: { members : deletedMemberID }}, 
            {safe: true}
            )
            .then(updated => {
                console.log(updated);
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err);
            })

    }

    // TODO related tasks
    static findOneTodo(req, res) {
        let id = req.params.todo_id

        Todo.find({_id: id})
            .then(todo => {
                res.status(200).json(todo)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static addTodo(req, res) {
        let project_id = req.params.id

        let todo = {
            title: req.body.title,
            description: req.body.description,
            dueDate: new Date(req.body.dueDate),
            owner: req.user._id,
            status: 'open'
        }
        let newTodo

        Todo.create(todo)
            .then(created => {
                newTodo = created

                return Project
                    .findOneAndUpdate({_id: project_id}, {$push: {todos: created._id}}, {new: true})
                    .populate('todos')
            })
            .then(function(project) {
                res.status(201).json(newTodo)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static removeTodo(req, res) {
        let todo_id = req.params.todo_id
        Project
            .findOneAndUpdate({_id: project_id}, {$pull: {todos: todo_id}}, {new: true})
            .populate('todos')
            .then((project) => {
                return Todo.findOneAndDelete({_id: todo_id})
            })
            .then(function(todo) {
                res.status(200).json(todo)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static updateTodo(req, res) {
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
}

module.exports = ProjectController