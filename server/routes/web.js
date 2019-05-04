const express = require('express');

const entryRoute = require('./entry');
const projectRoute = require('./project');
const todoRoute = require('./todo');

const { errorhandler } = require('../middlewares/errorhandler');

const router = express.Router();

router.use('/', entryRoute);
router.use('/projects', projectRoute);
router.use('/todos', todoRoute);

router.use(errorhandler);

module.exports = router;
