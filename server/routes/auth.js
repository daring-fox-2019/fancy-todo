const routes = require('express').Router()

const UserController = require('../controllers/User')

routes.post('/register', UserController.create)
routes.post('/login', UserController.login)

module.exports = routes
