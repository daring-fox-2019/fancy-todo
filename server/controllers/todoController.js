const Todo = require("../models/todo")
const User = require("../models/user")
const jwt = require('jsonwebtoken')
const moment = require("moment")
class TodoController {
    static create(req, res) {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_KEY)
        let ownerId = ''
        if (decoded) ownerId = decoded.id
        console.log(req.body.due_date)
        let momentDate = moment(`${req.body.due_date}`).format("LL")
        let newTodo = new Todo({
            owner: ownerId,
            title: req.body.title,
            created_at: new Date,
            status: 0,
            description: req.body.description,
            due_date : momentDate
        })
        newTodo.save()
        .then(created=>{
            res.status(201).json(created)
        })
        .catch(err=>{
            console.log(err)
            if (err.errors.due_date) res.status(400).json({
                msg: err.message
            })
            else{
                res.status(500).json({
                    msg: err.message
                })
            }
        })
    }
    static findAll(req, res) {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_KEY)
        let obj = {}
        if (decoded) {
            obj.owner = decoded.id
        }
        Todo.find(obj)
            .sort("-created_at")
            .populate("owner", '-password')
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                console.log(err.message)
                res.status(500).json({
                    msg: err.message
                })
            })
    }
    static update(req, res) {
        let obj = {}
        for (let key in req.body){
            obj[key] = req.body[key]
        }
        if (req.body.status)obj.finished_at = new Date
        Todo.findOneAndUpdate({ _id: req.params.id }, obj, { new: true , runValidators: true})
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                console.log(err.message)
                res.status(500).json({
                    msg: err.message
                })
            })
    }

    static delete(req,res){
        Todo.findOneAndDelete({_id: req.params.id})
        .then(deleted=>{
            res.status(200).json(deleted)
        })
        .catch(err=>{
            console.log(err.message)
            res.status(500).json({
                msg: err.message
            })
        })
    }
}

module.exports = TodoController