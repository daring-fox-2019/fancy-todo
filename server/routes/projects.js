const route = require('express').Router()
const authenticate = require('../middlewares/authenticate')
const {authorizeProject, authorizeProjectOwner, adminOnly} = require('../middlewares/authorize')
const ProjectController = require('../controllers/projectController')
const TodoController = require('../controllers/todoController')

route.post('/', authenticate, ProjectController.create)
route.get('/', authenticate, ProjectController.findValidProjects)

route.post('/:id/addMember', authenticate, authorizeProjectOwner, ProjectController.addMember)
route.post('/:id/removeMember', authenticate, authorizeProjectOwner, ProjectController.removeMember)

route.patch('/:id', authenticate, authorizeProjectOwner, ProjectController.update)
route.put('/:id', authenticate, authorizeProjectOwner, ProjectController.update)
route.delete('/:id', authenticate, authorizeProjectOwner, ProjectController.delete)

//get All todos of a project project
route.get('/:id', authenticate, authorizeProject, ProjectController.findOne)
route.get('/:id/todos', authenticate, authorizeProject, ProjectController.findOne)
route.get('/:id/todos/:todo_id', authenticate, authorizeProject, ProjectController.findOneTodo)
route.post('/:id/todos', authenticate, authorizeProject, ProjectController.addTodo)

route.delete('/:id/todos/:todo_id', authenticate, authorizeProject, ProjectController.removeTodo)
route.patch('/:id/todos/:todo_id', authenticate, authorizeProject, ProjectController.updateTodo)

module.exports = route