const router = require('express').Router()
const authenticate = require('../middlewares/authenticate')
const todoController = require('../controllers/todoController')
const authorize = require('../middlewares/authorize')
router.use(authenticate)

router.get('/', todoController.getAll)
router.post('/', todoController.create)
router.put('/:id', authorize, todoController.replace)
router.patch('/:id', authorize, todoController.update)
router.delete('/:id', authorize, todoController.delete)
router.patch('/:id/urgent', authorize, todoController.toUrgent)
router.patch('/:id/done',authorize,todoController.done)
module.exports = router