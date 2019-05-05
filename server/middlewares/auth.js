const { verify } = require('../helpers/jwt');
const User = require('../models/users')
const Todo = require('../models/todos')

module.exports = {
  authenticate: function(req, res, next) {
    let token = req.headers.token;
    if (!token) {
      res.status(401).json({ error: 'You must login to access this endpoint' });
    } else {
      let decoded = verify(token);
      User
       .findOne({
         email: decoded.email
       })
       .then(user => {
         if(user) {
           req.user = user;
           next();
         } else {
           res.status(401).json({ error: 'User is not valid' });
         }
       })
       .catch(err => { res.status(500).json(err) })
    }
  },
  authorize: function(req, res, next) {
    let userId = (req.params.id) ? req.params.id : req.body.id
    Todo.findOne({ _id: userId })
      .then(todo => {
        if(todo.userId == req.user.id) {
          next()
        } else {
          res.status(401).json({ error: 'Unauthorized' })
        }
      })
      .catch(err => { res.status(500).json(err) })
  },
}
