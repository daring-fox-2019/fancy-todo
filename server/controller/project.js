const Project = require('../models/project');
const User = require('../models/user');
const Todo = require('../models/todo');
const { ObjectId } = require('mongoose').Types;

class ProjectController {
    static myProjects(req, res) {
        Project
            .find({
                $or: [
                    {
                        members: {
                            $in: req.authenticatedUser._id
                        }
                    },
                    { master: req.authenticatedUser._id }
                ]
            })
            .populate('master')
            .then(projects => {
                console.log(projects)
                res
                    .status(200)
                    .json(projects)
            })
            .catch(err => {
                res
                    .status(500)
                    .josn({
                        message: err.message
                    })
            })
    }

    static create(req, res) {
        let project = null;

        Project
            .create({
                name: req.body.name,
                master: req.authenticatedUser._id
            })
            .then(newProject => {
                project = newProject;

                return User.updateOne(
                    { _id: ObjectId(req.authenticatedUser._id) },
                    { $addToSet: { projects: newProject._id } }
                )
            })
            .then(result => {
                res
                    .status(201)
                    .json(project);
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    });
            });
    }

    static asignMember(req, res) {
        User
            .findOne({
                email: req.body.email
            })
            .then(user => {
                if (!user) {
                    res
                        .status(404)
                        .json({
                            message: 'User not found'
                        })
                } else {
                    return Project.updateOne(
                        { _id: req.params.id },
                        { $addToSet: { members: ObjectId(user._id) } }
                    )
                }
            })
            .then(result => {
                if (result.n && result.ok) {
                    res
                        .status(200)
                        .json(result)
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Project not found'
                        })
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    }

    static unasignMember(req, res) {
        Project
            .updateOne(
                { _id: ObjectId(req.params.id) },
                { $pull: { members: ObjectId(req.params.memberId) } }
            )
            .then(result => {
                if (result.n && result.ok) {
                    res
                        .status(200)
                        .json(result)
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Project not found'
                        })
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    }

    static projectDetail(req, res) {
        const option = {
            projects: 0,
            __v: 0,
            password: 0
        };

        Project
            .findById(req.params.id, { __v: 0 })
            .populate('master', option)
            .populate('members', option)
            .populate('todos')
            .then(project => {
                if (project) {
                    res
                        .status(200)
                        .json(project)
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Project not found'
                        })
                }
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
            .create(
                {
                    ...req.body,
                    project: req.params.id
                }
            )
            .then(newTodo => {
                return Project.updateOne(
                    { _id: ObjectId(req.params.id) },
                    { $push: { todos: newTodo._id } }
                )
            })
            .then(result => {
                if (result.n && result.ok) {
                    res
                        .status(200)
                        .json(result)
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Project not found'
                        })
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    }

    static removeTodo(req, res) {
        let arr = [
            Project
                .updateOne(
                    { _id: req.params.id},
                    { $pull: { todos: req.params.todoId } }
                ),
            Todo
                .deleteOne(
                    { _id: ObjectId(req.params.todoId) }
                )
            ]

        Promise
            .all(arr)
            .then(([resultProject, resultTodo]) => {
                console.log(resultProject, resultTodo)
                if (resultTodo.n && resultTodo.ok) {
                    res
                        .status(200)
                        .json(resultTodo)
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Project not found'
                        })
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    }

    static updateTodo(req, res) {
        Todo
            .updateOne(
                {
                    _id: ObjectId(req.params.todoId),
                },
                { $set: req.body },
                { new: true }
            )
            .then(result => {
                if (result.n && result.ok) {
                    res
                        .status(200)
                        .json(result)
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Todo not found'
                        })
                }
            })
            .catch(err => {
                console.log(err)
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    }

    static deleteProject(req, res) {
        Promise
            .all([
                Project.deleteOne({ _id: ObjectId(req.params.id) }),
                Todo.deleteMany({ project: ObjectId(req.params.id) })
            ])
            .then(result => {
                console.log(result)
                if ((result[0].n || result[0].ok) && (result[1].n || result[1].ok)) {
                    res
                        .status(200)
                        .json(result)
                } else {
                    res
                        .status(404)
                        .json({
                            message: 'Project not found'
                        })
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    }
}

module.exports = ProjectController;
