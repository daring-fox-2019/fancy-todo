const User = require('../models/user')
const Project = require('../models/project')

module.exports = {
    adminOnly: function(req, res, next) {
        if(req.user.role === 'admin') {
            next()
        }

        res.status(401).json('Must be admin')
    },
    authorizeProjectOwner: function(req, res, next) {
        let user = req.user
        let project_id = req.params.id

        if(user.role === 'admin') {
            next()
        }
        else {
            Project
            .findOne({owner: req.user._id, _id: project_id})
            .then(found => {
                if(found) {
                    next()
                }
                else {
                    res.status(401).json('Not authorized owner')
                }
            })
            .catch(err => [
                res.status(500).json(err)
            ])
        }
    },
    authorizeProject: function(req, res, next) {
        let user = req.user
        let project_id = req.params.id
        let todo_id = req.params.todo_id

        if(user.role === 'admin') {
            next()
        }
        else {
            Project
            .findOne({
                $and: [
                    {_id: project_id},
                    {$or: [{'owner': req.user._id}, {'members': req.user._id}]}
                ]
            })
            .then(found => {
                if(found) {
                    next()
                }
                else {
                    res.status(401).json('Not Authorized to the Project')
                }
            })
            .catch(err => [
                res.status(500).json(err)
            ])
        }
    },

}