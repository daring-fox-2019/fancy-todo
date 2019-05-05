const route = require('express').Router()
const {UserController} = require('../controllers')
route.get('/', UserController.findAll)
route.post('/', UserController.create)
route.delete('/:id', UserController.delete)
module.exports = route