const routes = require('express').Router()

const UserController = require('../controllers/User')

const { loggedIn } = require('../middlewares/auth')
const { isOwner } = require('../middlewares/users')

routes.get('/', loggedIn, UserController.findAll)
routes.post('/', UserController.create)

routes.get('/:user_id', loggedIn, isOwner, UserController.findById)
routes.put('/:user_id', loggedIn, isOwner, UserController.update)
routes.delete('/:user_id', loggedIn, isOwner, UserController.delete)

module.exports = routes
