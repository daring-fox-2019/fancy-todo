const express = require('express');
const routes = express.Router();
const todos = require('./todoRoute')
const users = require('./userRoute')

routes.use('/users', users)
routes.use('/todos', todos)

routes.get('*', (req, res) => {
    res.send('404 page not found')
})

module.exports = routes