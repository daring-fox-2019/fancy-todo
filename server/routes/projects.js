const route = require('express').Router()
const authenticate = require('../middlewares/authenticate')
const {authorizeProject, authorizeProjectOwner} = require('../middlewares/authorize')
const ProjectController = require('../controllers/projectController')
const TodoController = require('../controllers/todoController')

route.post('/', authenticate, ProjectController.create)

route.get('/', authenticate, authorizeProject, ProjectController.findAll)
route.get('/:id', authenticate, authorizeProject, ProjectController.findOne)

route.post('/:id/addMember', authenticate, authorizeProjectOwner, ProjectController.addMember)

route.patch('/:id', authenticate, authorizeProjectOwner, ProjectController.update)
route.put('/:id', authenticate, authorizeProjectOwner, ProjectController.update)
route.delete('/:id', authenticate, authorizeProjectOwner, ProjectController.delete)

module.exports = route