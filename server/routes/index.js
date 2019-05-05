const express = require('express');
const routes = express.Router();
const todos = require('./todoRoute')
const users = require('./userRoute')
const authentication = require('../middlewares/authentication')
const authorize = require('../middlewares/authorize')

routes.use('/users', users)
routes.use('/todos', authentication, authorize, todos)

routes.get('*', (req, res) => {
    res.status(404).json({msg: 'Page not found'})
})

module.exports = routes