const router = require('express').Router()

const userController = require('../controllers/userController')
const loginController = require('../controllers/loginController')

router.get('/',userController.getAll)
router.get('/:id',userController.getOne)
router.post('/register',userController.create)
router.post('/login',loginController.login)
router.post('/login/google',loginController.loginGoogle)
module.exports = router