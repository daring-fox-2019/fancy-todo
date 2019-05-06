const express = require('express');
const routes = express.Router();
const TodoController = require('../controllers/TodoController')

routes.post('/', TodoController.create)
routes.get('/', TodoController.list)
routes.get('/search', TodoController.search)
routes.put('/:id', TodoController.update)
routes.patch('/:id', TodoController.update)
routes.delete('/:id', TodoController.delete)

module.exports = routes