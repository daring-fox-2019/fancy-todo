const routes = require('express').Router()

routes.use('/auth', require('./auth'))
routes.use('/users', require('./users'))
routes.use('/todos', require('./todos'))
routes.use('/projects', require('./projects'))

module.exports = routes
