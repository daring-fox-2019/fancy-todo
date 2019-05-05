const router = require('express').Router()
const todoController = require('../controller/todoController')
//path https://localhost/todo

router.get('/', todoController.findAll)
router.get('/:todoId', todoController.findOne)
router.post('/', todoController.create)
router.patch('/:todoId', todoController.update)
router.delete('/:todoId', todoController.delete)

module.exports = router