const express = require("express");
const router = express.Router();

const TodoController = require("../controllers/todo-controller");
const UserController = require("../controllers/user-controller");
const { authorization } = require("../middlewares/auth");

router.get("/:projectId/", TodoController.getUserTodos);
// router.get("/", UserController.getUserTodos);
router.get("/:projectId/:todoId", TodoController.getTodo);
router.post("/", TodoController.createTodo);
router.put("/:projectId/:todoId", authorization, TodoController.updateTodo);
router.put("/:projectId/:todoId/status", authorization, TodoController.updateStatus);
router.delete("/:projectId/:todoId", authorization, TodoController.deleteTodo);

module.exports = router;