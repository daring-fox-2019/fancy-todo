const express            = require('express');
const router             = express.Router();
const userRoute          = require('./user');
const todoRoute          = require('./todo');
const projectRoute       = require('./project');
const { authentication } = require('../middlewares/auth');

router.use('/users', userRoute);

router.use(authentication);

router.use('/todos', todoRoute);
router.use('/projects', projectRoute);

module.exports = router;