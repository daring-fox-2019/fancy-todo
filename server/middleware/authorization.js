const projectModel = require('../model/project')
const todoModel = require('../model/todo')

module.exports = {

    projectAuthorization(req, res, next){
        projectModel.findOne({_id:req.params.id})
        .then( data => {
            if(data){
                if(data.user_id == req.headers.id) {
                    next()
                }
                else {
                    next({ message : 'Unauthorize'})
                }
            } else {
                next({ message : 'Not Found'})
            }
        })
        .catch(err => {
            next(err)
        })
    },
    todoAuthorization(req, res, next){
        todoModel.findOne({_id:req.params.id})
        .then( data => {
            if(data){
                if(data.user_id == req.headers.id) {
                    next()
                }
                else {
                    next({ message : 'Unauthorize'})
                }
            } else {
                next({ message : 'Not Found'})
            }
        })
        .catch(err => {
            next(err)
        })
    }

}