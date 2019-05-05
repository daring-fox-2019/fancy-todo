const User = require('../models/users')
const { hash } = require('../helpers/bcryptjs')
const { compare } = require('../helpers/bcryptjs')
const { sign } = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library');

class UserControllers {
  static create(req, res) {
    let { name, email, password } = req.body
    let hashed = (password != '') ? hash(password) : password
    let newUser = {
      name, email,
      password: hashed,
    }
    User.create(newUser)
      .then(data => {
        res.status(201).json({ data })
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static findAll(req, res) {
    User.find()
      .populate('todos')
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static findOne(req, res) {
    User.findOne({ _id: req.params.id })
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => { res.status(500).json({ message: err.message }) })
  }
  static update(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static delete(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then(user => {
        const response = {
          message: 'Successfully deleted user.',
          id: req.params.id
        }
        res.status(200).json(response)
      })
      .catch(err => { res.status(500).json({ message: err.message }) })
  }

  static login(req, res) {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          res.status(401).json({ message: 'user tidak ada/ password salah' })
        } else {
          // console.log({user: user.password, input: req.body.password})
          // console.log(compare(req.body.password, user.password) || req.body.password == user.password)
          if (!compare(req.body.password, user.password)) {
            res.status(401).json({ message: 'user tidak ada/ password salah' })
          } else if (compare(req.body.password, user.password) || req.body.password == user.password) {
            let obj = {
              name: user.name,
              email: user.email,
              id: user._id
            }
            let access_token = sign(obj)
            res.status(201).json({ 
              access_token,
              name: user.name,
              email: user.email,
              id: user._id,
              quote: user.singleTodo,
              check: user.singleCheck
             })
          }
        }
      })
      .catch(err => {
        res.status(500).json({ err: err.message })
      })
  }
  static loginGoogle(req, res) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    client.verifyIdToken({
      idToken: req.headers.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
      .then(ticket => {
        const payload = ticket.getPayload();
        User.findOne({ email: payload.email })
          .then(user => {
            console.log({user})
            if (!user) {
              return User.create({
                email: payload.email,
                name: payload.name,
                password: ''
              })
            } else {
              return user
            }
          })
          .then(user => {
            const access_token = sign({
              name: user.name,
              email: user.email
            })
            res.status(200).json({
              access_token,
              name: user.name,
              email: user.email,
              id: user._id,
              quote: user.singleTodo,
              check: user.singleCheck
            })
          })
          .catch(err => {
            res.status(500).json({ err: err.message })
          })
      })
      .catch(err => {
        console.log({err})
        res.status(500).json({ err: err.message })
      })
  }
  static updateSingle(req, res) {
    User.findByIdAndUpdate({_id: req.user._id}, {$set: {singleTodo: req.body.title}}, {new: true})
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err=> {res.status(500).json(err)})
  }
}

module.exports = UserControllers