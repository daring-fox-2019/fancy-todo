const router = require('express').Router()
const controller = require('../controllers/todo-c')
const { authentication } = require("../middlewares/auth")
const { authorization } = require("../middlewares/auth")

router.use(authentication)

router.post("/", controller.newTodos)

router.get("/", controller.viewAllTodos)

router.get("/:id", authorization, controller.viewOneTodo)

router.delete("/:id", authorization, controller.deleteOneTodo)

router.put("/:id", authorization, controller.updateOneTodo)

module.exports = router