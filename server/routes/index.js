const route = require('express').Router()
const auth = require('./auth')
const todos = require('./todos')
const projects = require('./projects')
const users = require('./users')

route.use('/auth', auth)
route.use('/todos', todos)
route.use('/projects', projects)
route.use('/users', users)

module.exports = route