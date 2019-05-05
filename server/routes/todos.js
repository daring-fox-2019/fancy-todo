const route = require('express').Router()
const TodoController = require('../controllers/todoController')
const authenticate = require('../middlewares/authenticate')
const {authorizeTodoOwner} = require('../middlewares/authorize')

route.post('/', authenticate, TodoController.create)
route.get('/', authenticate,authorizeTodoOwner, TodoController.find)
route.get('/:id', authenticate, authorizeTodoOwner, TodoController.findOne)
route.patch('/:id', authenticate, authorizeTodoOwner, TodoController.update)
route.put('/:id', authenticate, authorizeTodoOwner, TodoController.update)
route.delete('/:id', authenticate, authorizeTodoOwner, TodoController.delete)

module.exports = route