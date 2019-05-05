const tokenHelper = require('../helpers/tokenHelper')
const { User } = require('../models/user')
const { ToDo } = require('../models/todos')
const { Project } = require('../models/project')


module.exports = {
    authenticate: function (req, res, next) {
       if (req.headers.jwtoken) {
           try {
               let decoded = tokenHelper.decodeToken(req.headers.jwtoken)
               return User.findOne({
                   _id: decoded._id
                })
                .then(userFound => {
                       if (userFound) {
                           req.userId = decoded._id
                           next()
                       } else {
                           res.status(401).json('token is invalid!')
                       }
                   })
           } catch (error) {
               res.status(500).json('token is invalid!')
           }
       } else {
           res.status(401).json('please login to continue!')
       }
   },
   authorizeTodo: function(req,res,next){
        ToDo.findOne({_id: req.params.id})
        .then(result => {
            if(result.user == req.userId){
                next()
            } else {
                res.status(401).json({
                    msg: "You're not authorized!"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                msg: 'Error',
                err
            })
        })
   },
   authorizeTodoProject: function(req,res,next){
       console.log(req.body.projectId)
       Project.findOne({_id:req.body.projectId})
       .then(result => {
           if(result.members.filter(el => el == req.userId) != ''){
                next()
            } else {
                res.status(401).json({
                    msg: "You're not authorized!"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                msg: "Error",
                err
            })
        })
   },
   authorizeProjectTodoUDUserAdRem: function(req,res,next){
    Project.findOne({_id:req.params.id})
    .then(result => {
        if(result.owner==req.userId){
            next()
        } else {
            res.status(401).json({
                msg: "You're not authorized!"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            msg: "Error",
            err
        })
    })
   },
}