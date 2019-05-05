const express = require('express')
const router = express.Router()
const projectTodoController = require('../controller/projectTodo')

router.post('/new',projectTodoController.create)
router.post('/invite',projectTodoController.invite)
router.get('/',projectTodoController.readAll)


module.exports = router

