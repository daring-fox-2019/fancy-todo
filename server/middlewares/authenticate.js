// const Todo = require('../models/todo')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  console.log(req.headers)
  if(req.headers.hasOwnProperty('token')){
    req.decoded = jwt.verify(req.headers.token, process.env.KUNCI)
    next()
  }
  else{
    res.status(401).json({
      message: 'login dulu, baru masuk mas'
    })
  }
}