const router = require('express').Router()
const todo = require('./todo')
const TodoController = require('../controllers/TodoController')
const { validateProjectMember, authenticate, authorize, isProjectOwner, authorizeMember, validateActByProjectMember } = require('../middlewares')


router.get('/', authenticate, TodoController.findAll)
router.get('/:todoId', authenticate, TodoController.findOne)
router.post('/', authenticate, TodoController.createTodo)
router.delete('/:todoId', authenticate, authorize, TodoController.deleteTodo)
router.patch('/:todoId', authenticate, validateActByProjectMember, TodoController.updateTodo)


module.exports = router