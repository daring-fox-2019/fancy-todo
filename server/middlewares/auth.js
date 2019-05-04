const { verify } = require('../helpers/jwt')
const { User, Todo } = require('../models')

module.exports = {
  authenticate: function(req, res, next) {
    let token = req.headers.token
    if (!token) {
      res.status(401).json({ error: 'You must login to access this endpoint' })
    } else {
      let decoded = verify(token)
      User
       .findOne({
         _id: decoded.id
       })
       .then(user => {
         if(user) {
           req.user = user
           req.body.user = user
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
  authorize: function(req, res, next) {
    let { id } = req.params
    Todo.findOne({ _id: id })
     .then(todo => {
       if (todo.userId.toString() === req.user._id.toString()) {
         next()
       } else {
         res.status(403).json({ err: 'Forbidden' })
       }
     })
     .catch(err => {
       res.status(500).json(err)
     })
  },
}
