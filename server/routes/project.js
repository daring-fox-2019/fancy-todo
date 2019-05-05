const router = require('express').Router()
const project = require('./project')
const ProjectController = require('../controllers/ProjectController')
const { validateProjectMember, authenticate, authorize, isProjectOwner, authorizeMember} = require('../middlewares/index')


router.get('/', authenticate, ProjectController.findAll)
router.get('/:projectId', authenticate, ProjectController.findOne)
router.post('/', authenticate, ProjectController.create)
router.patch('/:projectId',  authenticate, isProjectOwner, ProjectController.updateProject)
router.delete('/:projectId', authenticate, isProjectOwner, ProjectController.deleteProject)
router.delete('/:projectId/:memberId', authenticate,isProjectOwner,  ProjectController.deleteMember)
router.patch('/invite/:projectId', authenticate, authorizeMember, ProjectController.inviteMembers)
router.patch('/accept/:projectId', authenticate,  ProjectController.acceptProject)
router.patch('/decline/:projectId', authenticate,  ProjectController.declineProject)
router.post('/todo/:projectId', authenticate, validateProjectMember, ProjectController.createTodoForThisProject)
router.delete('/todo/:projectId/:todoId', authenticate, authorizeMember, ProjectController.deleteTodoInThisProject)
router.get('/member/pending', authenticate,  ProjectController.findMemberInAnyPendingMembers)
router.patch('/msg/:projectId', authenticate, authorizeMember, ProjectController.postMsg )


module.exports = router