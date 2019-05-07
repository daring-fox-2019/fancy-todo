const router = require('express').Router()
const todoController = require('../../controller/todo')
const Auth = require('../../middleware/auth')
const removeTaskOnProject = require('../../middleware/projects').removeTask
const addTaskIdToProject = require('../../controller/project')
const Authorization = require('../../middleware/authorization')

router.post('/', Auth, todoController.createTodo, addTaskIdToProject.updateProject)
router.get('/', Auth, todoController.getAllTodo)
router.delete('/:id', Auth, Authorization.todoAuthorization, removeTaskOnProject, todoController.deleteTodo)
router.patch('/:id', Auth, Authorization.todoAuthorization, todoController.updateTodo)

module.exports = router