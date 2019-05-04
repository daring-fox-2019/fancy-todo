const route = require('express').Router()
const TodoController = require('../controllers/todoController')
const authenticate = require('../middlewares/authenticate')
const {authorizeTodoOwner} = require('../middlewares/authorize')

route.get('/', authenticate, TodoController.find)
route.get('/:id', authenticate, TodoController.findOne)
route.post('/', authenticate, TodoController.create)
route.patch('/:id', authenticate, authorizeTodoOwner, TodoController.update)
route.put('/:id', authenticate, authorizeTodoOwner, TodoController.update)
route.delete('/:id', authenticate, authorizeTodoOwner, TodoController.delete)

module.exports = route