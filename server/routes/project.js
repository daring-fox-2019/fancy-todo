const express = require('express');

const controller = require('../controllers/project');
const middleware = require('../middlewares/auth');

const router = express.Router();

const {

} = middleware;

const {

} = controller;

module.exports = router;
