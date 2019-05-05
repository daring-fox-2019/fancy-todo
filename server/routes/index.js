const express = require("express");
const usersRouter = require("../routes/users");
const todosRouter = require("../routes/todos");
const projectsRouter = require("../routes/projects");
const { authentication } = require("../middlewares/auth");
const router = express.Router();

router.use("/api", usersRouter);
router.use("/api/todos", authentication, todosRouter);
router.use("/api/projects", authentication, projectsRouter);

module.exports = router;