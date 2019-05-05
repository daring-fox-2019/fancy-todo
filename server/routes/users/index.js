const router = require('express').Router()
const UserController = require('../../controller/user')
const Auth = require('../../middleware/auth')
const findIdByEmail = require('../../middleware/user').generateIdFromEmail

router.post('/register', UserController.createUser)
router.post('/login', UserController.postLogin)
router.get('/getone', Auth, UserController.getOneUser)
router.get('/', Auth, UserController.getAllUser)
router.patch('/', Auth,findIdByEmail, UserController.patchUpdate)

module.exports = router