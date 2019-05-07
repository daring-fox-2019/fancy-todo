const express = require('express')
const router = express.Router()
const todos = require('../controllers/todoCon')

router.post('/addTodo', todos.addTodo)

module.exports = router