const Project = require('../models/Project')
const User = require('../models/user')


class ProjectTodoController {

  static readAll(req,res){
    User.find({ _id : req.user._id })
    .populate('projects')
      .then(user => {
        let project = user[0].projects.reverse()
        res.status(200).json(project)
      })
      .catch(error => {
        res.status(400).json(error)
      })

  }

  static create(req, res) {
    let project = { }
    Project.create({ name: req.body.name })
      .then((newProject) => {
        project = newProject
        return User.findByIdAndUpdate(req.user._id, {
          $push: { projects: newProject._id }
        })
      })
      .then(() => {
        res.status(201).json({ message: 'success', project })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: 'internal server error'})
      })
  }

  static invite(req, res) {
    console.log(req.body);
    User.findOne({ email: req.body.email })
    .then(function(user) {
      if(user) {
        let index = user.projects.findIndex(project => project._id.toString() == req.body.projectId )
        if(index == -1) {
          return User.findOneAndUpdate({ email: req.body.email} , {$push: { projects: req.body.projectId }}, { new: true })
        } else {
          return false
        }
      } else {
        return null
      }
    })
    .then(function(user) {
      if(user === null) {
        res.status(404).json({ message: 'user not found'})
      } else {
        res.status(201).json({ message: 'invited' })
      }
    })
    .catch(function(err) {
      console.log(err)
      res.status(500).json({ message: 'internal server error'})
    })

  }

}


module.exports = ProjectTodoController