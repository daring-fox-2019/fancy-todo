const Project = require('../models/project')
const Todo = require ('../models/todo')

module.exports = {
    validateActByProjectMember : async function (req,res,next) {
        try {
            if (Todo.projectId) {
                let match = await Project.findById(Todo.projectId._id)
                if (match.members.indexOf(req.authenticatedUser.id) >0 ) {
                    next
                } else {
                    res.status(401).json({msg : 'Not a valid member of this project. Cannot conduct this act!'})
                }
            } else {
                next()
            }
        } catch (error) {
            console.log(error, 'erroe cek act by proj memb');
            res.status(500).json(error)
        }
    }
}