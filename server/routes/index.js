const router = require('express').Router()
const todoRoute = require('./todoRoute')
const userRoute = require('./userRoute')

router.use('/users',userRoute)
router.use('/todos',todoRoute)

module.exports = router
