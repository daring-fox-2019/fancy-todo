const Todo = require('../models/todo')
const User = require('../models/user')
const ObjectID = require('mongodb').ObjectID

class TodoController{

    static getAll(req,res){
        Todo.find({})
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

    static create(req,res){
        // console.log(req.body,'========');
        // res.send(req.loggedUser)
        Todo.create({
            title : req.body.title,
            description: req.body.description,
            UserId : req.loggedUser.id,
            dueDate: req.body.dueDate,
            status : false,
            urgency: false
        })
        .then(value =>{
            // console.log(req.loggedUser,value);
            // res.status(200).json(value)
           return User.findOneAndUpdate({_id : req.loggedUser.id}, { "$push": { todoList: value._id }}, {new : true})
        })
        .then(value =>{
            res.status(200).json(value)
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                msg: `internal server error`
            })
        })
    }

    static replace(req,res){
        // console.log('masuk put');
        console.log(req.body);
        let option = {_id : ObjectID(req.params.id)}
        Todo.findOneAndUpdate(option,{$set : {
            title : req.body.title,
            description: req.body.description,
            UserId : req.loggedUser.id,
            dueDate: req.body.dueDate,
            status: false,
            urgency: req.body.urgency || "false"
        }},{new : true})
        .then(todo =>{
            console.log(todo)
            res.status(201).json({
                todo,
                msg: `todo successfully updated`
            })
        })
        .catch(err =>{
            console.log(err);
            res.status(501).json({
                msg : `internal server error`
            })
        })
    }

    static update(req,res){
        console.log('malah masuk sini');
        
        let option = {_id : ObjectID(req.params.id)}
        Todo.findOneAndUpdate(option,{$set : {
            [req.body.field] : req.body.value
        }},{new : true})
        .then(todo =>{
            res.status(201).json({
                todo,
                msg: `todo successfully updated`
            })
        })
        .catch(err =>{
            console.log(err);
            res.status(501).json({
                msg : `internal server error`
            })
        })
    }

    static delete(req,res){
        let option = {_id : ObjectID(req.params.id)}
        Todo.findOneAndDelete(option)
        .then((value) =>{
            // console.log(value);
            let user = ObjectID(value.UserId)
           return User.findOneAndUpdate(user,{$pull : {todoList : req.params.id}},{new:true})
        })
        .then(user =>{
            res.status(201).json({
                user,
                msg: `todo successfully deleted`
            })
        })
        .catch(err =>{
            console.log(err);
            res.status(501).json({
                msg : `internal server error`
            })
        })
    }

    static toUrgent(req,res){
        let option = { _id : ObjectID(req.params.id)}
        Todo.findOneAndUpdate(option,{$set : {urgency : true}},{new : true})
        .then(value =>{
            res.status(200).json({
                value,
                msg: `${value.title} is udpdated to urgent`
            })
        })
        .catch(err =>{
            console.log(err);
            res.status(501).json({
                msg: `internal server error`
            })
        })
    }

    static done(req,res){
        let option = { _id : ObjectID(req.params.id)}
        Todo.findOneAndUpdate(option,{$set : {status : true,urgency: "false"}},{new : true})
        .then(value =>{
            res.status(200).json({
                value,
                msg: `${value.title} is done`
            })
        })
        .catch(err =>{
            console.log(err);
            res.status(501).json({
                msg: `internal server error`
            })
        })
    }
}

module.exports = TodoController