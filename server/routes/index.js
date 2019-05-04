const route = require('express').Router()
const auth = require('./auth')
const todos = require('./todos')
const projects = require('./projects')

route.use('/auth', auth)
route.use('/todos', todos)
route.use('/projects', projects)

module.exports = route