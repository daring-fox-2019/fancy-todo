const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/google', userController.google)

router.get('/users', userController.showAll)
module.exports = router