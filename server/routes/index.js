const express = require('express')
const router = express.Router()
const user = require('./user.js') 
const todo = require('./todo.js')

router.use('/users', user)
router.use('/todos', todo)

module.exports = router