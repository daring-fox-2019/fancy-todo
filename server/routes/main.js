const express = require('express');

const controller = require('../controllers/main');
const middleware = require('../middlewares/auth');

const router = express.Router();

const {
  userAuthentication,
  projectOwnership,
  projectMembership,
} = middleware;

const {
  getProjectById,
  patchAddMemberToProject,
  postCreateTodoInProject,
  putEditTodoInProjectById,
  deleteTodoInProjectById,
} = controller;

router.use(userAuthentication);

router.get('/:projectId', projectMembership, getProjectById);
router.patch('/:projectId/member',projectOwnership, patchAddMemberToProject);
router.post('/:projectId/todo', projectMembership, postCreateTodoInProject);
router.put('/:projectId/todo/:todoId', projectMembership, putEditTodoInProjectById);
router.delete('/:projectId/todo/:todoId', projectMembership, deleteTodoInProjectById);

module.exports = router;
