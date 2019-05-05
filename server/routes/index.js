const router = require('express').Router()
const todo = require('./todo')
const project = require('./project')
const user = require('./user')

router.get('/', (req, res) => {
    res.status(200).json({msg : "connected"})
})

router.use('/users', user)
router.use("/todos", todo)
router.use("/projects", project)


module.exports = router