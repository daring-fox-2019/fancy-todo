const router = require('express').Router()
const UserController = require("../controllers/UserController")
const user = require('./user')

router.get('/', UserController.getAllUser)
router.post('/register', UserController.register)
router.post('/signin/local', UserController.signInLocal)
router.post('/signin/google', UserController.signInGoogle)


module.exports = router