
const User = require('../models/user')
const { decrypt } = require('../helpers/password')
const jwt = require('jsonwebtoken')

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
      res.json(err)
    })
  }

  static findOneUser(req,res){
    let condition = {
      email : req.body.email
    }
    User.findOne(condition)
    .then(result=>{
      if(result){
        if (decrypt(req.body.password, result.password) == true){ 
         let token = jwt.sign({email : result.email}, process.env.SECRET_JWT)
         let loggedIn = {
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
}

module.exports = ControllerUser