const express = require('express');
const routes = express.Router();
const TodoController = require('../controllers/TodoController')
const authentication = require('../middlewares/authentication')
const authorize = require('../middlewares/authorize')

routes.use(authentication)
routes.use(authorize)
 
routes.post('/', TodoController.create)
routes.get('/', TodoController.list)
routes.get('/search', TodoController.search)
routes.put('/:id', TodoController.update)
routes.patch('/:id', TodoController.update)
routes.delete('/:id', TodoController.delete)

module.exports = routes