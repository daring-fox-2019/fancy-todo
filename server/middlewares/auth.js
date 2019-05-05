const jwt = require('jsonwebtoken')
const {ObjectID} = require('mongodb')
const Todo = require('../models/user')

function authentication(req,res,next){
  try {
    let decoded = jwt.verify(req.headers.token, process.env.SECRET_JWT);
    if(decoded.id == req.headers.id){
      next();
    } else {
      res.status(403).json({message : "you have invalid token"})  
    }
  } catch(err) {
    // err
    res.status(403).json({message : "you have invalid token"})
  }
}

function authorization(req,res,next){
  let condition = {
    user : new ObjectID(req.headers.id),
    _id : new ObjectID(req.params.id)
    }
    
    Todo.findOne(condition)
    .then(result=>{
      if(result){
        next();
      } else {
        res.status(403).json({message : "you have no rights to access this "})
      }
    })
    .catch(err=>{
      res.status(403).json({message : "you have no rights to access this"})
    })
  }

module.exports = { authentication, authorization }