const router = require('express').Router()
const User = require('../routes/users')
const Todo = require('../routes/todos')
const Project = require('../routes/projects')
const Oauth = require('../routes/oauth')

router.use('/users', User)
router.use('/todos', Todo)
router.use('/projects', Project)
router.use('/oauth', Oauth)

module.exports = router