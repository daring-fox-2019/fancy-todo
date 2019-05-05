const router = require('express').Router();
const todoRouter = require('./todo');
const userRouter = require('./user');
const projectRouter = require('./project')

router.use('/todos', todoRouter)
router.use('/users', userRouter)
router.use('/projects', projectRouter)

module.exports = router