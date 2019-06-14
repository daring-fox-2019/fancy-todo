const ProjectController = require('../controllers/projectController')
const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')
const isProjectMember = require('../middlewares/isProjectMember')

router.use(authentication)
router.get('/pending', ProjectController.showPendingMember)
router.post('/', ProjectController.create)
router.get('/', ProjectController.showAll)
router.get('/:id', ProjectController.showOne)
router.delete('/:id', ProjectController.delete)
router.put('/:id', ProjectController.update)
router.put('/addTodo/:id', isProjectMember, ProjectController.addProjectsTodo)
router.put('/invite/:id', ProjectController.inviteMember)
router.put('/join/:id', ProjectController.joinProject)
router.put('/decline/:id', ProjectController.declineProject)

module.exports = router