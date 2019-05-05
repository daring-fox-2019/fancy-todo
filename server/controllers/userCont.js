require('dotenv').config()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  static GoogleSignIn(req, res) {
    let payload = null;
    client.verifyIdToken({
      idToken: req.body.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
      .then((ticket) => {
        payload = ticket.getPayload();
        const userid = payload['sub']
        console.log(ticket);
        return User.findOne({ email: payload.email })
      })
      .then((user) => {
        if (user) {
          let payload = {
            name: user.name,
            email: user.email
          }
          let token = jwt.sign(payload, process.env.API_KEY)
          console.log('token --->', token, '<---token')
          res.status(200).json({ token })
        } else {
          return User.create({
            name: payload.name,
            email: payload.email,
            password: "123456"
          })
            .then((user) => {
              let payload = {
                name: user.name,
                email: user.email
              }
              let token = jwt.sign(payload, process.env.API_KEY)
              console.log('token --->', token, '<---token')
              res.status(200).json({ token })
            })
            .catch((err) => {
              res.status(500).json(err)
            })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  }

  static register(req, res) {
    User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
      .then(result => {
        return User.findOne({ email: req.body.email })
      })
      .then(result => {
        if (result) {
          let { name } = result
          let payload = {
            name: result.name,
            email: result.email
          }
          console.log(process.env.KUNCI)
          let token = jwt.sign(payload, process.env.KUNCI)
          console.log('token regis-->', token)
          res.status(200).json({
            token, name
          })
        } else {
          res.status(404).json({
            message: "User Not Found"
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static login(req, res) {
    User
      .findOne({
        email: req.body.email
      })
      .then(result => {
        if (result) {
          const isSame = bcrypt.compareSync(req.body.password,result.password)
          if(isSame){
            let { name } = result
            let payload = {
              _id: result._id,
              name: result.name,
              email: result.email
            }
            let token = jwt.sign(payload, process.env.KUNCI)
            console.log('token login-->', token)
            res.status(200).json({
              token, name
            })
          }
          else {
            res.status(403).json({
              message: 'Email atau password salah'
            })
          }
        } 
        else {
          res.status(404).json({
            message: "Email atau password salah"
          })
        }
      })
      .catch(err => {
        let message       
        if(err) {
          if(err.message) message = err.message
          else message = err
        }
        else message = "Internal Server Error Login"
        res.status(500).json({
          message
        })
      })
  }

  static logout(req, res) {
    // i dunno
  }
}

module.exports = UserController