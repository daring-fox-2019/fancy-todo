const router = require('express').Router()
const user = require('../../controller/user')

router.post('/google-sign-in',user.googleSignIn)

module.exports = router