const Todo = require('../models/todos')
const Project = require('../models/project')
const ProjectMod = Project.Project

module.exports = {
    showOneProject: function (req, res) {
        let id = req.params.id
        Project.findOne(id)
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })
    },
    showAllProject: function (req, res) {
        Project.findAll(req.userId)
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })
    },
    addProject: function (req, res) {
        let {
            project,
            description,
            members,
            todos
        } = req.body
        let owner = req.userId
        if (!members.includes(owner)){
            members.push(owner)
        }
        Project.create(
                project,
                description,
                owner,
                members,
                todos
            )
            .then((result) => {
                res.status(201).json({
                    msg: 'You have successfully created new project!',
                    report: result
                })
            })
            .catch(function (err) {
                res.status(400).json(`${err.message}`)
            })
    },
    updateProject: function (req, res) {
        let {
            project,
            description,
            members,
            todos
        } = req.body
        let owner = req.userId
        Project.update(
                req.params.id,
                project,
                description,
                owner,
                members,
                todos
            )
            .then(function (data) {
                res.status(201).json({
                    msg: 'You have successfully updated your project!',
                    report: data
                })
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })

    },
    deleteProject: function (req, res) {
        let id = req.params.id
        Project.delete(id)
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })
    },

    //project related user methods

    addMember: function(req,res) {
        ProjectMod.findOne({_id: req.params.id})
        .then(data => {
            if(data.members.includes(req.params.userId)){
                res.status(400).json({
                    msg: `${userId} is already a member!`
                })
            } else {
                data.members.push(req.params.userId)
                data.save()
                .then(() => {
                    res.status(201).json({
                        msg: 'You have successfully added new member into project!'
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        msg: 'Error',
                        report: err
                    })
                })
            }
        })
    },
    removeMember: function(req,res) {
        ProjectMod.updateOne({_id: req.params.id}, {
            $pullAll: {members: req.params.userId}
        })
        .then(data => {
            res.status(201).json({
                msg: "You have successfully remove a member from project!",
                report: data
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: 'Error',
                report: err
            })
        })
    },

    //project related todo methods

    showAllToDoProj(req, res) {
        Project.findOne(req.params.id).populate('todos')
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })
    },
    addToDoProj(req, res) {
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
        Todo.create(
                todo, start, end, description, location, status, req.body.projectId
            )
            .then((data) => {
                return ProjectMod.updateOne({
                        _id: req.body.projectId
                    }, {
                        $push: {
                            todos: data._id
                        }
                    })
                    .then(result => {
                        res.status(201).json({
                            msg: "You have successfully created new project task!",
                            report: result
                        })
                    })
            })
            .catch(function (err) {
                res.status(500).json(`${err.message}`)
            })
    },
    updateToDoProj: function (req, res) {
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
        Todo.update(req.params.todoId, todo, start, end, description, location, status)
            .then(function (data) {
                res.status(200).json(data)
            })
            .catch(function (err) {
                res.status(500).json(err.message)
            })
    },
    deleteToDoProj: function (req, res) {
        let id = req.params.todoId
        Todo.delete(id)
            .then(function (data) {
                console.log('suk')
                ProjectMod.updateOne({_id:req.params.id},{
                    $pull: {todos: id}
                })
                .then(result => {
                    res.status(200).json({
                        msg: 'You have successfully delete a task in Project!',
                        report: result
                    })
                })
            })
            .catch(function (err) {
                console.log(err)
                res.status(500).json(err.message)
            })
    }
}