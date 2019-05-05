const { verify } = require('../helpers/jwt')
const Todo = require('../models/todoModel')

module.exports = (req, res, next) => {
    const decoded = verify(req.headers.token)
    Todo
        .findOne({ _id: req.params.id })
        .populate('UserId')
        .then((foundUser) => {
            if (foundUser.UserId.email === decoded.email) next()
            else res.status(401).json({ type: 'AUTHORIZATION ERROR', message: 'You do not have access to this page!' })
        })
}
