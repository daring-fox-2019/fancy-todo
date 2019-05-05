const router = require('express').Router();
const controller = require('../controllers/todo')
const {authenticate, authorizeTodo} = require('../middlewares/auth')

router.use(authenticate)
router.get('/', controller.findAll)
router.post('/', controller.create)


router.use('/:id', authorizeTodo)
router.get('/:id', controller.findOne)
router.patch('/:id', controller.updateOne)
router.delete('/:id', controller.deleteOne)


module.exports = router