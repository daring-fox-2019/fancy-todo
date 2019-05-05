const Project = require('../models/project')

module.exports = {
    isProjectOwner : async function (req,res,next) {
        try {
            console.log('masuk cek owner');
            console.log(req.params,'apa aja nih');
            
            let foundProject = await Project.findById(req.params.projectId)
            if (req.authenticatedUser.id == foundProject.createdBy._id) {
                next ()
            } else {
                res.status(401).json({msg : 'Conducting major changes can only be done by owner!'})
            }
        } catch (error) {
            console.log(error, 'erroe cek own');
            
            res.status(500).json(error)
        }
    }
}