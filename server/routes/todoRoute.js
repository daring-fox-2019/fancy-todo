const router = require('express').Router()
const todoController = require('../controllers/todoController');
const authentication = require('../middlewares/authentication')


router.use(authentication)
router.post('/',todoController.create)
router.get('/',todoController.showAll)
router.get('/:id',todoController.showOne)
router.put('/:id', todoController.update)
router.delete('/:id', todoController.delete)

module.exports = router