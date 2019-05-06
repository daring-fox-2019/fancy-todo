const router = require('express').Router()
const projectController = require('../../controller/project')
const Auth = require('../../middleware/auth')
const addTask = require('../../middleware/projects').addTask
const removeAllTask = require('../../middleware/projects').removeTaskAllTask
const Authorization = require('../../middleware/authorization')


router.post('/', Auth, projectController.createProject)
router.patch('/:id', Auth, addTask, projectController.updateProject)
router.get('/:id', Auth, projectController.getOneProject)
router.get('/', Auth, projectController.getAllProjectsByUserId)
router.delete('/:id', Auth, Authorization.projectAuthorization, projectController.deleteProject)

module.exports = router