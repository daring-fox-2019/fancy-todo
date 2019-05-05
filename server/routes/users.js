const route = require('express').Router()
const UserController = require('../controllers/userController')
const authenticate = require('../middlewares/authenticate')

route.get('/', authenticate, UserController.findAll)

module.exports = route