const router = require('express').Router();
const controller = require('../controllers/user')
const {googleVerify} = require('../middlewares/google-verify')
const {authenticate} = require('../middlewares/auth')

router.post('/login', controller.login)
router.post('/google-login', googleVerify, controller.googleLogin)
router.post('/register', controller.register)

router.use(authenticate)
router.get('/', controller.findAll)

module.exports = router