const express = require('express');
const routes = express.Router();
const OpenApiController = require('../controllers/OpenApiController')

routes.get('/bored', OpenApiController.generateRandomActivity)

module.exports = routes

