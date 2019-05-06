const User         = require('../models/user');
const Todo         = require('../models/todo');
const Project      = require('../models/project');
const { decode }   = require('../helpers/jwt');
const { ObjectId } = require('mongoose').Types

module.exports = {
    authentication: function (req, res, next) {
        try {
            const token = req.headers.accesstoken
            if (token) {
                const decoded = decode(req.headers.accesstoken)
                req.authenticatedUser = decoded

                if (process.env.NODE_ENV === 'test') {
                    next();
                } else {
                    User
                        .findById(req.authenticatedUser._id)
                        .then(user => {
                            if (user) {
                                
                                next();
                            } else {
                                res
                                    .status(401)
                                    .json({
                                        message: 'Token is not valid'
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
            } else {
                res
                    .status(401)
                    .json({
                        message: 'Please login to continue'
                    })
            }
        } catch (err) {
            res
                .status(401)
                .json({
                    message: 'Please login to continue'
                })
        }
    },

    authorization: function (req, res, next) {
        Todo
            .findById(req.params.id)
            .then(todo => {
                if (todo) {
                    if (String(todo.owner) !== req.authenticatedUser._id) {
                        res
                            .status(403)
                            .json({
                                message: 'Forbidden'
                            })
                    } else {
                        next()
                    }
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
                        message: 'Internal Server Error'
                    })
            })
    },

    projectAuth: function (req, res, next) {
        Project
            .findById(req.params.id)
            .then(project => {
                if (!project) {
                    res
                        .status(404)
                        .json({
                            message: 'Project not found'
                        })
                } else {
                    if (String(project.master) === req.authenticatedUser._id || project.members.indexOf(ObjectId(req.authenticatedUser._id)) >= 0) {
                        next()
                    } else {
                        res
                            .status(403)
                            .json({
                                message: 'Forbidden'
                            })
                    }
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    })
            })
    },

    projectMasterAuth: function(req, res, next) {
        Project
            .findOne(
                { 
                    _id: ObjectId(req.params.id),
                    master: ObjectId(req.authenticatedUser._id)
                }
            )
            .then(project => {
                if (!project) {
                    res
                        .status(403)
                        .json({
                            message: 'Forbidden'
                        })
                } else {
                    next()
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