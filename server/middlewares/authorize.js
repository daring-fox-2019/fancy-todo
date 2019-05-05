const Todo = require('../models/todo')
const mongoose = require('mongoose')
const ObjectId = mongoose.mongo.ObjectId

module.exports = (req, res, next) => {
  console.log(req.decoded,req.params.id)
  Todo.findOne({_id: ObjectId(req.params.id)})
  .then(row=>{
    console.log(typeof row.user)
    if(ObjectId(req.params.id) == row.user){
      next()
    }
    else{
      res.status(401).json({
        message: 'Not Authorized'
      })
    }
  })
  .catch(err=>{
    res.status(400).json({
      message: "Todo gak ketemu"
    })
  })
}