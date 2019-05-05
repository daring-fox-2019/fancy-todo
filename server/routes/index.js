const route = require('express').Router()
const UserControllers = require('../controllers/userController')
const TodoControllers = require('../controllers/todoControllers')

const { authenticate, authorize } = require('../middlewares/auth')

route.get('/', (req, res) => {res.status(200).json({message: 'Home'})})
route.post('/register', UserControllers.create)
route.post('/login', UserControllers.login)
route.post('/login/google', UserControllers.loginGoogle)

route.get('/users', UserControllers.findAll)
route.get('/users/:id', UserControllers.findOne)
route.put('/users/:id', UserControllers.update)
route.delete('/users/:id', UserControllers.delete)

route.post('/todos', authenticate, TodoControllers.create)
route.get('/todos', TodoControllers.findAll)
route.get('/todos/:id', TodoControllers.findOne)
route.put('/todos/:id', authenticate, authorize, TodoControllers.update)
route.delete('/todos/:id', authenticate, authorize, TodoControllers.delete)

route.use('/*', (req, res) => res.status(404).json({error: 'Not Found :('}))

module.exports = route