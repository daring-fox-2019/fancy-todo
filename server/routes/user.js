const express = require('express')
const router = express.Router()
const user = require('../controllers/userCon')

router.post('/signinGoogle', user.GoogleSignIn)
router.post('/signup', user.Register)
router.post('/signin', user.Login)

module.exports = router