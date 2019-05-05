const router = require('express').Router({mergeParams:true})
const controller = require('../controller/projects')
const{ authenticate,authorizeProjectTodoUDUserAdRem,authorizeTodoProject,authorizeTodo } = require('../middlewares/auth')

router.use(authenticate)
router.post('/', controller.addProject)
router.get('/',controller.showAllProject)
router.get('/:id', controller.showOneProject)
router.put('/:id', authorizeProjectTodoUDUserAdRem, controller.updateProject)
router.delete('/:id', authorizeProjectTodoUDUserAdRem, controller.deleteProject)

//project related user routes

router.patch('addMember/:id/:userId', authorizeProjectTodoUDUserAdRem, controller.addMember)
router.patch('removeMember/:id/:userId', authorizeProjectTodoUDUserAdRem, controller.removeMember)

//project related todo routes
router.use(authorizeTodoProject)
router.get('/:id', controller.showAllToDoProj)
router.post('/:id',controller.addToDoProj)
router.put('/:id/:todoId', controller.updateToDoProj)
router.delete('/:id/:todoId', controller.deleteToDoProj)


module.exports = router