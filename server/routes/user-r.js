const router = require('express').Router()
const controller = require('../controllers/user-c')

router.get("/", (req,res)=>{
  res.send("users")
})

router.post("/login", controller.findOneUser)

router.post("/register", controller.createNewUser)

router.post("/loginGoogle", controller.signInGoogle)



module.exports = router