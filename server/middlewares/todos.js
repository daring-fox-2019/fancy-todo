const TodoModel = require('../models/Todo')

const isExist = (req, res, next) => {
  TodoModel
    .findOne({
      _id: req.params.todo_id,
      authorId: req.user._id
    })
    .then(todo => {
      if (todo) {
        req.todo = todo
        next()
      } else {
        res.status(404).json({ message: 'Todo Not Found' })
      }
    })
    .catch(() => res.status(500).json({ message: 'Internal Server Error' }))
}

module.exports = { isExist }
