const projectModel = require('../model/project')


class Project{
    static createProject(req, res, next){
        const {name} = req.body
        const user_id = req.headers.id
        const task = []

        projectModel.create({name, task, user_id})
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            next(err)
        })
    }

    static getAllProjectsByUserId(req, res, next){
        const _id = req.headers.id

        projectModel.find({user_id: _id})
        .populate('task')
        .then(data => {
            res.status(200).json(data)
        })
        .catch( err  => {
            next(err)
        })
    }

    static deleteProject(req, res, next){
        const _id = req.params.id

        projectModel.findOneAndDelete({_id})
        .then( () =>{
            res.status(204).json()
        })
        .catch(err => {
            next(err)
        })
    }

    static getOneProject(req, res, next){
        const _id = req.params.id

        projectModel.findOne({_id})
        .populate({path: 'task',
            populate : {
                path: 'user_id',
                select : {'name' : '0', 'email' : '0', 'project_list' : '0'}
            }
        })
        .populate('user_id')
        .then( data => {
            res.status(200).json(data)
        })
        .catch( err => {
            next(err)
        })
    }

    static updateProject(req, res, next){
        let id = req.params.id
        const { task_id } = req.body
        const { user_list } = req.body
        const { name } = req.body

        if(!id){
            id = req.headers.project_id
        }
      
        projectModel.findOne({ _id : id})
        .then(data => {
            if(task_id){
                data.task.push(task_id)
            }
            if( user_list ){
                data.user_list.push(user_list)
            }
            data.name = name || data.name
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

module.exports = Project