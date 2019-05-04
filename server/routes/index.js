const router = require('express').Router()
const user = require('./user.js')
const todo = require('./todo.js')
const project = require('./project.js')

router.use('/users', user)
router.use('/todos', todo)
router.use('/projects', project)

module.exports = router