const router = require('express').Router()
const controller = require('../controllers/todo-c')
const authentication = require("../middlewares/auth")

router.post("/", controller.newTodos)

router.get("/", controller.viewAllTodos)

router.get("/:id", controller.viewOneTodo)

router.delete("/:id", controller.deleteOneTodo)

router.put("/:id", controller.updateOneTodo)

module.exports = router