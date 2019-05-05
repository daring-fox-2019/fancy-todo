const jwt = require('jsonwebtoken')

const UserModel = require('../models/User')

class User {
  static findAll (req, res) {
    UserModel
      .find()
      .then(users => res.status(200).json({ users }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static findById (req, res) {
    UserModel
      .findById(req.params.user_id)
      .then(user => res.status(200).json({ user }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static create (req, res) {
    UserModel
      .create({
        email: req.body.email,
        password: req.body.password
      })
      .then(user => res.status(201).json({ user }))
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
      })
  }

  static update (req, res) {
    UserModel
      .findById(req.params.user_id)
      .then(user => {
        user.email = req.body.email
        user.password = req.body.password
        return user.save()
      })
      .then(user => res.status(200).json({ user }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static delete (req, res) {
    UserModel
      .findByIdAndDelete(req.params.user_id)
      .then(user => res.status(200).json({ user }))
      .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
  }

  static login (req, res) {
    UserModel
      .findOne({
        email: req.body.email
      })
      .then(user => {
        if (user && user.comparePassword(req.body.password)) {
          let jwtToken = jwt.sign({
            _id: user._id,
            email: user.email,
            password: user.password
          }, process.env.JWT_SECRET)
          res.status(201).json({
            token: jwtToken,
            user
          })
        } else {
          res.status(400).json({ message: 'Bad Credential' })
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
      })
  }
}

module.exports = User
