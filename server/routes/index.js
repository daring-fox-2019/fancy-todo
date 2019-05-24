const express = require('express')
const router = express.Router()
const user = require('./user')
const todo = require('./todo')
const projectTodos = require('./projectTodo')
const {isUser, isAuthorize} = require('../middlewares')

router.get('/',(req,res)=>{
  res.status(200).json('masuk')
})


router.use('/users',user)
router.use('/todos', isUser, todo)
router.use('/todoproject', isUser, projectTodos)



module.exports = router