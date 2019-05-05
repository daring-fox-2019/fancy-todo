const User = require('../models/user')
const Project = require('../models/project')
const Todo = require('../models/todo')

module.exports = {
    adminOnly: function(req, res, next) {
        if(req.user.role === 'admin') {
            next()
        }

        res.status(401).json('Must be admin')
    },
    authorizeTodoOwner: function(req, res, next) {
        let user = req.user
        let todo_id = req.params.id

        if(user.role === 'admin') {
            next()
        }
        else if(!todo_id) {
            next()
            /* Todo
            .findOne({owner: user._id})
            .then(found => {
                if(found) {
                    next()
                }
            })
            .catch(err => [
                res.status(500).json(err)
            ]) */
        }
        else {
            Todo
            .findOne({_id: todo_id, owner: user._id})
            .then(found => {
                if(found) {
                    next()
                }
                else {
                    res.status(401).json('Not Authorized for this Todo')
                }
            })
            .catch(err => [
                res.status(500).json(err)
            ])
        }
    },
    authorizeProjectOwner: function(req, res, next) {
        let user = req.user
        let project_id = req.params.id

        if(user.role === 'admin') {
            next()
        }
        else {
            Project
            .findOne({owner: req.user._id, _id: project_id})
            .then(found => {
                if(found) {
                    next()
                }
                else {
                    res.status(401).json('Not authorized owner')
                }
            })
            .catch(err => [
                res.status(500).json(err)
            ])
        }
    },
    authorizeProject: function(req, res, next) {
        let user = req.user
        let project_id = req.params.id
        let todo_id = req.params.todo_id

        if(user.role === 'admin') {
            next()
        }
        else {
            Project
            .findOne({
                $and: [
                    {_id: project_id},
                    {$or: [{'owner': req.user._id}, {'members': req.user._id}]}
                ]
            })
            .then(found => {
                if(found) {
                    next()
                }
                else {
                    res.status(401).json('Not Authorized to the Project')
                }
            })
            .catch(err => [
                res.status(500).json(err)
            ])
        }
    },

}