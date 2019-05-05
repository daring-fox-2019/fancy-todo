const Project = require('../models/project')
const User = require('../models/user')

module.exports = {
    validateProjectMember : async function (req,res,next) {
        console.log(req.params, req.body, 'hai dapet ga req nya di validate?');
        
        try {
            let foundUserByEmail = await User.findOne({email : req.body.email}) 
            let found = await Project.findById(req.params.projectId)
            console.log(found.members, 'siapa aja membernya', foundUserByEmail,'ini yg mau diinvite loh');
            console.log(found.members.indexOf(foundUserByEmail._id.toString()), 'ISINYA BRP?');
            
            if (found.members.indexOf(foundUserByEmail._id.toString()) >= 0) {
                next()
            } else {
                res.status(401).json({msg : 'Conducting changes to a non project-member is an unauthorized act!'})
            }
        } catch (error) {
            console.log(error, 'dibagian validate member atau enggak');
            res.status(500).json(error)
        }
    }
}