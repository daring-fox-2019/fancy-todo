const user = require('../models/user')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
const { hash, compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')

class User {
  static findAll(req, res) {
    user.find({})
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        console.log(err.message);
      })
  }

  static create(req, res) {
    let newUser = new user({
      name: req.body.name,
      email: req.body.email,
      password: hash(req.body.password)
    })
    user.create(newUser)

      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        console.log(err.message);
      })
  }

  static googleLogin(req, res) {
    let payload;
    client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.CLIENT_ID
    })
      .then(ticket => {
        payload = ticket.getPayload() // dari sana

        return user.findOne({
          email: payload.email
        })
      })
      .then((foundUser) => {
        if (foundUser) {
          const token = sign({ _id: foundUser._id, name: foundUser.name, email: foundUser.email })
          res.status(200).json({ token, userId : foundUser._id })
        } else {
          let newUser = new user({
            name: payload.name,
            email: payload.email,
            password: hash(payload.email)
          })
          user.create(newUser)
            .then(data => {
              const token = sign({ _id: data._id, name: data.name, email: data.email })
              res.status(200).json({ token, userId : data._id })
            })

        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err.message)
      })
  }

  static login(req, res) {
    user.findOne({
      email: req.body.email
    })
      .then(found => {

        if (found) {
          if (compare(req.body.password, found.password)) {
            let token = sign({
              _id: found._id,
              name: found.name,
              email: found.email
            })
            res.status(200).json({ token, userId : found._id  })
          } else {
            res.status(400).json({ message: `Wrong Username/Password` })
          }
        } else {
          res.status(400).json({ message: `Wrong Username/Password` })
        }
      })
      .catch(err => {
        res.status(500).json(err.message)
      })
  }
}

module.exports = User