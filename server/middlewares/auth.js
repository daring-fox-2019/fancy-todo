const { verify } = require('../helpers/jwt')
const { User, Todo, Project } = require('../models')

module.exports = {
  authenticate: function (req, res, next) {
    let token = req.headers.token
    if (!token) {
      res.status(401).json({ error: 'You must login to access this endpoint' })
    } else {
      let decoded = verify(token, res)
      User
        .findOne({
          _id: decoded.id
        })
        .then(user => {
          if (user) {
            req.user = user
            next()
          } else {
            res.status(401).json({ error: 'User is not valid' })
          }
        })
        .catch(err => {
          res.status(500).json(err)
        })
    }
  },
  authorize: function (req, res, next) {
    let { todoId } = req.params
    Todo.findOne({ _id: todoId })
      .then(todo => {
        console.log(todo.userId, req.user._id)
        if (todo.userId.toString() === req.user._id.toString()) {
          next()
        } else {
          Project.findOne({ todos: todo._id })
            .then(project => {
              let isMember
              for(let item of project.members) {
                if (project.owner.toString() === req.user._id.toString()
                || item == req.user._id.toString()) {
                  isMember = true
                }
              }
              if(isMember) {
                next()
              } else {
                res.status(403).json({ error: 'Not a part of this project.' })
              }
              // res.status(403).json({ err: 'Forbidden' })
            })
            .catch(err => {
              console.log({err})
              res.status(500).json(err)
            })
        }
      })
      .catch(err => {
        console.log({err})
        res.status(500).json(err)
      })
  },
  authorizeProject: function (req, res, next) {
    let { projectId } = req.params
    Project.findOne({ _id: projectId })
      .then(project => {
        let isMember = false
        for (let item of project.members) {
          console.log(item)
          if (project.owner.toString() === req.user._id.toString()
          || item == req.user._id.toString()) {
            isMember = true
          }
        }
        if(isMember) {
          next()
        } else {
          res.status(403).json({ error: 'Not a part of this project.' })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
}
