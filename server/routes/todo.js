const router = require('express').Router()
const todo = require('../controllers/todo')
const {authentication, authorization} = require('../middleware/auth')

router.get('/', todo.findAll)
router.get('/:id', todo.findOne)

router.use(authentication)
router.post('/', todo.create)

router.use(authorization)
router.put('/:id', todo.update)
router.patch('/:id', todo.changeStatus)
router.delete('/:id', todo.delete)

module.exports = router