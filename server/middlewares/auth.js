const jwt = require('jsonwebtoken')
const Todo = require('../models/todo')
const { ObjectID } = require('mongodb')


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
    _id : new ObjectID(req.params.id),
    user : new ObjectID(req.headers.id),
    }
    console.log(condition)

    Todo.findOne(condition)
    .then(result=>{
      console.log(result)
      if(result){
        next();
      } else {
        console.log("ga ketemu")
        res.status(403).json({message : "you have no rights to access this aaaa "})
      }
    })
    .catch(err=>{
      console.log("error difind one")
      res.status(403).json({message : "you have no rights to access this"})
    })
  }

module.exports = { authentication, authorization }