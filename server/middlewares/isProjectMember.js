const Project = require('../models/projectModel')
const User = require('../models/userModel')

module.exports = (req, res, next) => {
    let userId = null;
  
    User.findOne({ email : req.body.email})
    .then((user) => {
        userId = user._id
        return Project.findById(req.params.id)
    })
    .then((project) => {
        console.log(project);
        
        if (project.members.indexOf(userId) >= 0) {
            console.log(project.members.indexOf(userId) >= 0);
            next()
        } else {
            res.status(500).json({msg: 'user is not a member!'})
        }
    })
}