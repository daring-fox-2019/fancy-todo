const ProjectModel = require('../models/Project')

const isExist = (req, res, next) => {
  ProjectModel
    .findOne({
      _id: req.params.project_id,
      $or: [{
        managerId: req.user._id
      }, {
        membersId: req.user._id
      }]
    })
    .then(project => {
      if (project) {
        req.project = project
        next()
      } else {
        res.status(404).json({ message: 'Project Not Found' })
      }
    })
    .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
}

const isManager = (req, res, next) => {
  if (String(req.project.managerId) === String(req.user._id)) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized Access' })
  }
}

const isSelf = (req, res, next) => {
  if (req.user.id === req.params.member_id) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized Access' })
  }
}

module.exports = { isExist, isManager, isSelf }
