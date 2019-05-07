const todoModel = require('../model/todo')
const projectModel = require('../model/project')
const userModel = require('../model/user')

module.exports = {
    addTask : function(req, res, next){
        const {task, description } = req.body
        const project_id = req.params.id
        const user_id = req.headers.id
        const status = 'new'

        if(task && description){
            todoModel.create({task, description, status, user_id, project_id})
            .then( data => {
                req.headers.task = data._id
                next()
            })
            .catch( err => {
                next(err)
            })
        } else {
            next()
        }
    },


    removeTask : function(req, res, next){
        const task_id = req.params.id

        todoModel.findOne({_id : task_id})
        .then( data => {
            if(data.project_id){
                projectModel.findOne({_id: data.project_id})
                .then( project_data => {
                    project_data.task.splice(project_data.task.indexOf(task_id, 1))
                    return project_data.save()
                })
                .then( save_data => {
                    next()
                })
                .catch(err => {
                    next(err)
                })
            } else {
                next()
            }
        })
        .catch(err => {
            next(err)
        }) 
    },

    
}