const Project = require('../models/project')
const User = require('../models/user')

module.exports = {
    authorizeMember : async function (req,res,next) {
        try {
            let foundProject = await Project.findById(req.params.projectId)
            if (foundProject.members.indexOf(req.authenticatedUser.id) >= 0) {
                next()
            } else {
                res.status(401).json({msg : 'Only members can create changes on this project'})
            }
            
        } catch (error) {
            res.status(500).json(error)
        }
    }
}