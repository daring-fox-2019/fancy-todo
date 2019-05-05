const router = require('express').Router()
const todoController = require('../controller/todos')
const {authenticate,authorizeTodo,authorizeTodoProject} = require('../middlewares/auth')

router.use(authenticate)
router.get('/', todoController.showAllToDo)
router.get('/:id', todoController.showOneToDo)
router.post('/', todoController.addToDo)
router.put('/:id', authorizeTodo, todoController.updateToDo)
router.delete('/:id', authorizeTodo, todoController.deleteToDo)

module.exports = router