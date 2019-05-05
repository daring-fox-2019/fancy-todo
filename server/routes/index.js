const route = require('express').Router()
const { ControllerUser, ControllerTodo, ControllerProject } = require('../controllers')
const { authenticate, authorize, authorizeProject } = require('../middlewares/auth')

route.get('/', (req, res) => {res.status(200).json({page: 'Home'})})

// ========================== User ==========================

route.post('/register', ControllerUser.create)
route.post('/login', ControllerUser.login)
route.post('/auth/google', ControllerUser.googleLogin)
route.get('/users', ControllerUser.findAll)
route.get('/users/:id', ControllerUser.findOne)
route.put('/users/:id', ControllerUser.update)
route.delete('/users/:id', ControllerUser.delete)

// ========================== Todo ==========================

route.use(authenticate)
route.post('/todos', ControllerTodo.create)
// route.post('/todos/:projectId', ControllerTodo.create)
route.get('/todos', ControllerTodo.findAll)
route.get('/todos/myTodo', ControllerTodo.findMyTodo)

route.use('/todos/:todoId', authorize)
route.get('/todos/:todoId', ControllerTodo.findOne)
route.put('/todos/:todoId', ControllerTodo.update)
route.delete('/todos/:todoId', ControllerTodo.delete)

// ========================== Project ==========================

route.post('/projects', ControllerProject.create)
route.get('/projects', ControllerProject.findAll)
route.get('/projects/myProjects', ControllerProject.findMyProject)

route.put('/projects/todos/:todoId', ControllerTodo.update)
route.delete('/projects/todos/:todoId', ControllerTodo.delete)
route.get('/projects/todos/:projectId', ControllerTodo.findProjectTodos)

route.post('/projects/:projectId', ControllerProject.createTodo)
route.use('/projects/:projectId', authorizeProject)
route.get('/projects/:projectId', ControllerProject.findOne)
route.put('/projects/:projectId', ControllerProject.update)
route.delete('/projects/:projectId', ControllerProject.delete)

route.put('/projects/:projectId/:userId', ControllerProject.editMembers)

route.use('/*', (req, res) => res.status(404).json({error: 'Not Found :('}))

module.exports = route