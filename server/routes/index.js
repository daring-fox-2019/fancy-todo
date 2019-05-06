const route = require('express').Router()
const user = require('../controller/user')
const todo = require('../controller/todo')

route.post('/signup', user.register)
route.post('/signin', user.login)
route.post('/gsignin', user.googleSign)
route.get('/todo/:owner', todo.read)
route.post('/todo', todo.create)
route.put('/todo/:id', todo.update)
route.delete('/todo/:id', todo.delete)

module.exports = route