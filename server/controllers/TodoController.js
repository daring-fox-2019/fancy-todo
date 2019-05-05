const Todo = require('../models/todo')

class TodoController {

    static async createTodo(req,res) {
        try {
            let todo = await Todo.create({...req.body, type : 'personal', userId : req.authenticatedUser.id})
            res.status(201).json(todo)
        } catch (error) {
            console.log(error,'bagiancreate todo');
            res.status(400).json(error)
        }
    }

    static async deleteTodo(req,res) {
        try {
            let found = await Todo.findByIdAndRemove(req.params.todoId)
            if (found) res.status(200).json(found)
            else res.status(404).json({message : 'No such todo found'})
        } catch (error) {
            console.log(error, 'error di delete')

            res.status(400).json(error)
        }
    }

    static async updateTodo(req,res) {
        try {
            let updated = await Todo.findByIdAndUpdate(req.params.todoId, {$set : {...req.body}}, { new: true})
            res.status(200).json(updated)
        } catch (error) {
            console.log(error, 'error di updatetodo')

            res.status(400).json(error)
        }
    }

    static async findOne(req,res) {
        try {
            let found = await Todo.findById(req.params.todoId).populate('userId').populate('projectId')
            res.status(200).json(found)
        } catch (error) {
            console.log(error, 'error di findone')
            res.status(400).json(error)
        }
    }

    static async findAll(req, res) {
        try {
            let list = await Todo.find({userId : req.authenticatedUser.id})
            res.status(200).json(list)
        } catch (error) {
            console.log(error, 'error di finall')
            res.status(400).json(error)
        }
    }

    static async findByQuery(req, res) {
        try {
            let obj = {}
            if (req.query) {
                let arr = []
                let field = Object.keys(req.query)
                field.forEach((q) => {
                    arr.push({
                        [q] : {$regex : new RegExp(req.query[q], "i")}
                    })
                })

                if (arr.length > 0) {
                    obj = {$or : arr}
                }
            }
            let todoGroups = await Todo.find(obj).populate('userId').populate('projectId')
            res.status(200).json(found)
        } catch (error) {
            console.log(error, 'error di find group')
            res.status(400).json(error)
        }
    }

 }

module.exports = TodoController