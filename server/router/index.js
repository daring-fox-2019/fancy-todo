const router = require('express').Router({mergeParams:true})
const todo = require('./todo')
const project = require('./project')
const controller = require('../controller/users')

router.get('/', controller.getAllUsers)
router.post('/login', controller.auth)
router.post('/register', controller.register)
router.use('/todo', todo)
router.use('/project', project)

module.exports = router