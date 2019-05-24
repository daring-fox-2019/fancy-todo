const express = require('express')
const router = express.Router()
const userController = require('../controller/user')

router.get('/',(req,res)=>{
  res.status(200).json('masuk user')
})


router.post('/register',userController.registrasi)
router.post('/signin',userController.signin)
router.post('/googlesignin',userController.googleSignin)



module.exports = router