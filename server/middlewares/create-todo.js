const Todo = require('../models/todo')

module.exports = {
    createTodo(req,res,next) {
        if(!req.body.addTodo) next()
        else {
        
            // console.log('---------- middlewares update todo create')

            const {name, description, dueDate, inProject, addTodo, project} = req.body
            const createdAt = new Date()
            const status = false
            const obj_create = {name, description, dueDate, inProject, addTodo, status, project, createdAt}
            // console.log(obj_create)

            Todo.create(obj_create)
            .then(created => {
                req.body.addTodo = created._id
                // console.log(created)
                // console.log('------------------------------created')
                next()
            })
            .catch(err => {
                res.status(500).json({
                    message: 'error when creating todo in middleware'
                })
            })
        }
    }
}