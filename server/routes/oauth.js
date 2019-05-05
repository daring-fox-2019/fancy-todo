const route = require('express').Router()
const {UserController} = require('../controllers')
route.post('/', UserController.login)
module.exports = route