const router = require('express').Router()
const userController = require('../controllers/user')

router.post('/', userController.create)
router.post('/googleLogin', userController.googleLogin)
router.post('/login', userController.login)

module.exports = router