const route = require('express').Router()
const UserController = require('../controllers/userController')

route.post('/login', UserController.login)
route.post('/google', UserController.googleLogin)
route.post('/fb', UserController.fbLogin)
route.post('/register', UserController.create)

module.exports = route