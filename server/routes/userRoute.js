const express = require('express');
const routes = express.Router();
const UserController = require('../controllers/UserController')

routes.get('/list', UserController.list)
routes.post('/signup', UserController.signup)
routes.post('/signin', UserController.signin)
routes.post('/todo-create/:userId', UserController.createToto)

module.exports = routes