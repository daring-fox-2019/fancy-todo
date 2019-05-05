const route = require('express').Router()
const {TodoController} = require("../controllers")
const {Authorization} = require('../middlewares/authorization')

route.get('/', TodoController.findAll)
route.post('/', TodoController.create)
route.patch('/:id',Authorization, TodoController.update)
route.delete('/:id',Authorization, TodoController.delete)
module.exports = route