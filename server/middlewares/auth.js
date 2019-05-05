const jwt = require('jsonwebtoken')

const UserModel = require('../models/User')

const loggedIn = (req, res, next) => {
  if ('authorization' in req.headers) {
    let token = req.headers.authorization
    try {
      let payload = jwt.verify(token, process.env.JWT_SECRET)
      UserModel
        .findById(payload._id)
        .then(user => {
          if (user) {
            req.user = user
            next()
          } else {
            res.status(401).json({ mesage: 'Invalid Token' })
          }
        })
    } catch (e) {
      res.status(401).json({ message: 'Invalid Token' })
    }
  } else {
    res.status(400).json({ message: 'Missing Token' })
  }
}

module.exports = { loggedIn }
