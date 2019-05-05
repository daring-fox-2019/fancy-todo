const router = require('express').Router()
const user = require('../routes/user-r')
const todo = require('../routes/todo-r')

router.get("/", (req,res)=>{
  res.send("localhost 3000")
})

router.use("/users", user)
router.use("/todos", todo)

module.exports = router