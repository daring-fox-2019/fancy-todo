const router = require("express").Router()
const Controller = require("../controller.js")

router.post("/", Controller.newUser)
router.post("/login", Controller.login)
router.get("/readAll", Controller.allUsers)

module.exports = router;