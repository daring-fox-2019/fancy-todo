const User = require('../models/user')
const ObjectID = require('mongodb').ObjectID

class userController{

    static getAll(req,res){
        User.find({})
        .populate('todoList')
        .then(value =>{
            res.status(200).json(value)
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                msg : 'internal server error'
            })
        })
    }

    static getOne(req,res){
        let id = ObjectID(req.params.id)
        // console.log(id);
        User.findOne({_id : id})
        .populate('todoList')
        .then(value =>{
            console.log(value);
            res.status(200).json(value)
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                msg : `internal server error`
            })
        })
    }

    static create(req,res){
        let user = new User({
            firstName : req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        user.save()
        .then(value =>[
            res.status(200).json(value)
        ])
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                msg: `internal server error`
            })
        })
    }
}

module.exports = userController

