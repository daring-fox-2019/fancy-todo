const userModel = require('../model/user')
const projectModel = require('../model/project')

module.exports = {
    generateIdFromEmail(req, res, next){
        if(req.headers.email){
            projectModel.findOne({_id: req.body.project_id})
            .then( data => {
                if(data) {
                    if(data.user_id == req.headers.id){
                        userModel.findOne({email: req.headers.email})
                        .then( data => {
                            if(data){
                                req.headers.id = data._id
                    
                                if(data.project_list.indexOf(req.body.project_id) == -1) {
                                    next()
                                } else {
                                    next({message : `User already registered`})
                                }
                            } else {
                                next({message : `Not Found`})
                            }
                        })
                        .catch(err => {
                            next(err)
                        })
                    }
                    else {
                        next({message : `Unauthorize`})
                    }
                } else {
                    next({message : `Not Found`})
                }
            })
           
        } else {
            next()
        }
    }
}