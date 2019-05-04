const express = require('express');
const routes = express.Router();
const TodoController = require('../controllers/TodoController')

routes.get('/list', TodoController.list)
routes.get('/list/:todoName', TodoController.findOne)
// routes.post('/create', TodoController.create)
routes.put('/update/:todoId', TodoController.update)
routes.patch('/update/:todoId', TodoController.update)
routes.delete('/delete/:todoId', TodoController.delete)

module.exports = routes