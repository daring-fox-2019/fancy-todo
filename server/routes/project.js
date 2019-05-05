const router = require('express').Router();
const controller = require('../controllers/project')
const {authenticate, authorizeProject} = require('../middlewares/auth')
const {createTodo} = require('../middlewares/create-todo')

router.use(authenticate)
router.post('/', controller.create)
router.get('/', controller.findAll)

router.use('/:id', authorizeProject)
router.get('/:id', controller.findOne)
router.delete('/:id', controller.deleteOne)
router.patch('/:id', createTodo, controller.updateOne)

module.exports =  router;