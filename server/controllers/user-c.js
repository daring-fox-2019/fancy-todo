const User = require('../models/user')
const { decrypt } = require('../helpers/password')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID);


class ControllerUser{
  static createNewUser(req,res){
    let newUser = {
      name : req.body.name,
      email : req.body.email,
      password : req.body.password
    }

    User.create(newUser)
    .then(result=>{
      res.json(result)
    })
    .catch(err=>{
      res.json(null)
      
    })
  }

  static findOneUser(req,res){
    console.log("disini")
    console.log(req.body)
    let condition = {
      email : req.body.email
    }

    User.findOne(condition)
    .then(result=>{
      if(result){
        if (decrypt(req.body.password, result.password) == true){ 
         let token = jwt.sign({email : result.email, id : result._id}, process.env.SECRET_JWT)
         let loggedIn = {
           id : result._id,
           user : result.email,
           token
         }
         res.json(loggedIn)
        } else {
          throw { message : "password / email wrong" }
        }
      } else {
        throw { message : "password / email wrong" }
      }
    })
    .catch(error=>{
      res.json(error)
    })
  }

  static signInGoogle(req, res) {
    var newEmail = ''
    client.verifyIdToken({
            idToken: req.headers.token,
            audience: process.env.CLIENT_ID
        })
        .then(function(ticket) {
            newEmail = ticket.getPayload().email
            return User.findOne({
                email: newEmail
            })
        })
        .then(function(userLogin) {
            if (!userLogin) {
                return user.create({
                    email: newEmail,
                    password: 'password'
                })
            } else {
                return userLogin
            }
        })
        .then(function(newUser) {
            let token = jwt.sign({
                email: newUser.email,
                id: newUser._id
            }, process.env.SECRET)
            let obj = {
                token,
                id: newUser._id,
                email: newUser.email
            }
            res.status(200).json(obj)
        })
        .catch(function(err) {
            console.log(err)
            res.status(500).json(err)
        })
  }

}

module.exports = ControllerUser