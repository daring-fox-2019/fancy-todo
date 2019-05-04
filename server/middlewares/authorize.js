const User = require('../models/user')
const Project = require('../models/project')

module.exports = {
    authorizeProjectOwner: function(req, res, next) {
        let user = req.user
        
        if(user.role === 'admin') {
            next()
        }
        else {
            Project
            .findOne({'owner': req.user._id})
            .then(found => {
                if(found) {
                    next()
                }
                else {
                    res.status(401).json('Must be project owner')
                }
            })
            .catch(err => [
                res.status(500).json(err)
            ])
        }
    },
    authorizeProject: function(req, res, next) {
        let user = req.user
        
        if(user.role === 'admin') {
            next()
        }
        else {
            Project
            .findOne()
            .or([{'owner': req.user._id}, {'members': req.user._id}])
            .exec()
            .then(found => {
                if(found) {
                    next()
                }
                else {
                    res.status(401).json('Not Authorized to Project')
                }
            })
            .catch(err => [
                res.status(500).json(err)
            ])
        }
    },

}