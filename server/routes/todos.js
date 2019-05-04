const route = require('express').Router()
const TodoController = require('../controllers/todo')

route.get('/', TodoController.find)
route.get('/:id', TodoController.findOne)
route.post('/', TodoController.create)
route.patch('/:id', TodoController.update)
route.put('/:id', TodoController.update)
route.delete('/:id', TodoController.delete)

module.exports = route