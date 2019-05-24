const jwt = require('jsonwebtoken')
const Todo = require('../models/todo')
const ObjectId = require('mongodb').ObjectId

module.exports = function(req,res,next){
    let option = ObjectId(req.params.id)
    Todo.findOne(option)
    .then(Todo =>{
        // console.log('masuuuk');
        if(req.loggedUser.id === Todo.UserId){
            // console.log('masuxxxxx');
            next()
        }else{
            res.status(401).send({
                msg : `you're not authorized for this action`
            })
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({
            msg: `internal server error`
        })
    })
    
}