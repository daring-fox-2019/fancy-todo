const routes = require('express').Router()

const TodoController = require('../controllers/Todo')

const { loggedIn } = require('../middlewares/auth')
const { isExist } = require('../middlewares/todos')

routes.get('/', loggedIn, TodoController.findAll)
routes.post('/', loggedIn, TodoController.create)

routes.get('/:todo_id', loggedIn, isExist, TodoController.findById)
routes.put('/:todo_id', loggedIn, isExist, TodoController.update)
routes.delete('/:todo_id', loggedIn, isExist, TodoController.delete)

module.exports = routes
