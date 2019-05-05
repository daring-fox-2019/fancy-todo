const routes = require('express').Router()

const ProjectController = require('../controllers/Project')
const { loggedIn } = require('../middlewares/auth')
const { isExist, isManager } = require('../middlewares/projects')
const todos = require('../middlewares/todos')

routes.use('/', loggedIn)

routes.get('/', ProjectController.findAll)
routes.post('/', ProjectController.create)

routes.use('/:project_id', isExist)

routes.get('/:project_id', ProjectController.findById)
routes.put('/:project_id', isManager, ProjectController.update)
routes.delete('/:project_id', isManager, ProjectController.delete)

routes.put('/:project_id/members', isManager, ProjectController.addMember)
routes.delete('/:project_id/members', ProjectController.leaveProject)
routes.delete(
  '/:project_id/members/:member_id',
  isManager,
  ProjectController.removeMember
)

routes.put('/:project_id/todos', ProjectController.addTodo)
routes.delete(
  '/:project_id/todos/:todo_id',
  todos.isExist,
  ProjectController.removeTodo
)

module.exports = routes
