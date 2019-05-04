const route = require('express').Router()
const { ControllerUser, ControllerTodo, ControllerProject } = require('../controllers')
const { authenticate, authorize } = require('../middlewares/auth')

route.get('/', (req, res) => {res.status(200).json({page: 'Home'})})

// ========================== User ==========================

route.post('/register', ControllerUser.create)
route.post('/login', ControllerUser.login)
route.get('/users', ControllerUser.findAll)
route.get('/users/:id', ControllerUser.findOne)
route.put('/users/:id', ControllerUser.update)
route.delete('/users/:id', ControllerUser.delete)

// ========================== Todo ==========================

route.use(authenticate)
route.post('/todos', ControllerTodo.create)
route.get('/todos', ControllerTodo.findAll)
route.use('/todos/:id', authorize)
route.get('/todos/:id', ControllerTodo.findOne)
route.put('/todos/:id', ControllerTodo.update)
route.delete('/todos/:id', ControllerTodo.delete)

// ========================== Project ==========================

route.post('/projects', ControllerProject.create)
// route.post('/projects/:projectId', ControllerProject.createTodo)
route.get('/projects', ControllerProject.findAll)
route.use('/projects/:id', authorize)
route.get('/projects/:id', ControllerProject.findOne)
route.put('/projects/:id', ControllerProject.update)
route.delete('/projects/:id', ControllerProject.delete)

route.use('/*', (req, res) => res.status(404).json({error: 'Not Found :('}))

module.exports = route