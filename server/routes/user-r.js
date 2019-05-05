const router = require('express').Router()
const controller = require('../controllers/user-c')

router.get("/", (req,res)=>{
  res.send("users")
})

router.post("/register", controller.createNewUser)

router.post("/login", controller.findOneUser)

router.post("/loginGoogle", (req,res)=>{
  res.send("users")
})

router.post("/logOutGoogle", (req,res)=>{
  res.send("users")
})


module.exports = router