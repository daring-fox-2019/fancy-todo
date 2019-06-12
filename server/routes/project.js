const router = require('express').Router()
const project = require('../controllers/project')
const {authentication, authorization} = require('../middleware/auth')

router.use(authentication)
router.get('/', project.findAll)
router.post('/', project.create)

// router.use(authorization)
router.post('/addMember/:id', project.addMember)
router.post('/deleteMember/:id', project.deleteMember)
router.get('/:id', project.findOne)
router.put('/:id', project.update)
router.delete('/:id', project.delete)

module.exports = router