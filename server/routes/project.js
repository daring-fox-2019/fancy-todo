const express = require('express');

const controller = require('../controllers/project');
const middleware = require('../middlewares/auth');

const router = express.Router();

const {
  userAuthentication,
  projectOwnership,
} = middleware;

const {
  getAllProjects,
  postCreateProject,
  putEditProjectById,
  deleteProjectById,
} = controller;

router.use(userAuthentication);

router.get('/', projectOwnership, getAllProjects);
router.post('/', postCreateProject);
router.put('/:id', projectOwnership, putEditProjectById )
router.delete('/:id', projectOwnership, deleteProjectById);

module.exports = router;
