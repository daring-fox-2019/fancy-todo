const todo = require('../models/todoModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class todoController{
    static findAll(req,res){
        let id = ObjectId(req.decoded.id)
        todo
            .find({ UserId: id })
            .then(todo =>{
                console.log('hello di controller')
                res.status(200).json({data: todo})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }
    static findOne(req,res){
        let id = ObjectId(req.decoded.id)
        let todoId = ObjectId(req.params.todoId)
        todo
            .findOne({ 
                UserId: id, 
                _id: todoId
            })
            .then( todo =>{
                res.status(200).json({data: todo})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }
    static create(req,res){
        console.log('berhasil create')
        let id = ObjectId(req.decoded.id)
        let objInput = {
            title: req.body.title,
            due_date: null,
            reminder: null,
            UserId: id,
            status: 0
        }
        todo
            .create(objInput)
            .then( todoCreated =>{
                res.status(200).json({data:todoCreated})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }
    static update(req,res){
        let todoId = req.params.todoId
        todo
            .findById(todoId)
            .then(user =>{
                user.set(req.body)
                return user.save()
            })
            .then(updatedUser =>{
                res.status(200).json({data: updatedUser})
            })
    }
    
    static delete(req,res){
        let todoId = req.params.todoId
        todo
            .findByIdAndDelete(todoId/*id*/)
                .then( deleted => {
                    res.status(200).json({data: deleted})
                })
                .catch( err => {
                    res.status(404).json({error: err})
                })
    }

}

module.exports = todoController