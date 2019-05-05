const router = require("express").Router()
const Controller = require("../controller.js")

router.get("/", Controller.readAll)
router.get("/notdone", Controller.notdone)
router.get("/done", Controller.done)
router.get("/:id", Controller.readOne)
router.post("/", Controller.create)
router.delete("/:id", Controller.delete)
router.put("/:id", Controller.update)

module.exports = router;