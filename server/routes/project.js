const express                              = require('express');
const router                               = express.Router();
const projectController                    = require('../controller/project');
const { projectAuth, projectMasterAuth }   = require('../middlewares/auth');

router.get('/', projectController.myProjects);
router.post('/', projectController.create);
router.get('/:id', projectAuth, projectController.projectDetail);
router.put('/:id/add-todo', projectAuth, projectController.addTodo);
router.put('/:id/add-member', projectAuth, projectController.asignMember);
router.patch('/:id/:todoId', projectAuth, projectController.updateTodo);
router.delete('/:id/:todoId', projectAuth, projectController.removeTodo);
router.delete('/:id/:memberId', projectMasterAuth, projectController.unasignMember);
router.delete('/:id', projectMasterAuth, projectController.deleteProject);

module.exports = router;
