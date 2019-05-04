const express = require('express');

const controller = require('../controllers/todo');
const middleware = require('../middlewares/auth');

const router = express.Router();

const {
  userAuthentication,
  todoOwnership,
} = middleware;

const {
  getAllTodos,
  getTodoById,
  postCreateTodo,
  putEditTodoById,
  deleteTodoById,
} = controller;

router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.post('/', postCreateTodo);
router.put('/:id', putEditTodoById);
router.delete('/:id', deleteTodoById);

module.exports = router;
