const {verify} = require('../helpers/jwt')
const User = require('../models/user')
const Todo = require('../models/todo');
const Project = require('../models/project')

module.exports = {
    authenticate(req,res,next) {
        if(!req.headers.token) {
            res.status(400).json({
                message: 'please provide valid access token',
            })
        } else {
            const decoded = verify(req.headers.token)
            const {email} = decoded;

            User.findOne({email})
            .then(found => {
                if(email === found.email) {
                    req.decoded = decoded;
                    next()
                }
                else {
                    res.status(400).json({
                        message:'invalid access token'
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message:'error find one'
                })
            })
        }
    },
    authorizeTodo(req,res,next) {
        Todo.findOne({_id:req.params.id})
        .then(found => {
            if(found.inProject) {
                return Project.findOne({_id: found.project, members: req.decoded._id})
                .then(found => {
                    console.log(found)
                    console.log('masuk ke authorize todo project')
                    next()
                }) 
            } else if(found.user.toString() === req.decoded._id) {
                next()
            } else {
                res.status(401).json({
                    message:'not authorized - todo action'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message:'error finding todo',
                error: err,
            })
        })
    },
    authorizeProject(req,res,next) {
        Project.findOne({_id:req.params.id})
        .then(found => {
            if(found.members.includes(req.decoded._id)) {
                next()
            } else if (req.decoded._id == found.createdBy) {
                console.log('masuk lhooo ke else if auth')
                next()
            } else {
                res.status(400).json({message:'not authorized'})
            }
        })
        .catch(err => {
            res.status(500).json({
                message:'error findone project',
                error: err,
            })
        })
    }
}