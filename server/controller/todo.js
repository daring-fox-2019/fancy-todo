const todoModel = require('../model/todo')

class Todo{
    static createTodo(req, res, next){
        let {task, description, project_id, due_date} = req.body
        const user_id = req.headers.id
        const status = 'new'

        if(project_id == ''){
            project_id = null
        }
        todoModel.create({task, status, user_id, description, project_id, due_date})
        .then(data => {
            if(project_id){
                req.headers.project_id = project_id
                req.body.task_id = data._id
                next()
            } else {
                res.status(201).json(data)
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static getAllTodo(req, res, next){
        const user_id = req.headers.id

        todoModel.find({user_id}).populate({path: 'user_id', select: {'name' : '0', 'email': '0', 'project_list' : '0'}})
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            next(err)
        })
    }

    static deleteTodo(req, res, next){
        const _id = req.params.id

        todoModel.deleteOne({_id})
        .then(() => {
            res.status(204).json()
        })
        .catch(err => {
            next(err)
        })
    }

    static updateTodo(req, res, next){
        const _id = req.params.id
        let {task, description, status, due_date} = req.body

        todoModel.findOne({_id})
        .then(data => {
            data.task = task || data.task
            data.description = description || data.description
            data.status = status || data.status
            data.due_date = due_date || data.due_date
            return data.save()
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = Todo