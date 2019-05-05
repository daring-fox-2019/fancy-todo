const isOwner = (req, res, next) => {
  if (req.user.id === req.params.user_id) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized Access' })
  }
}

module.exports = { isOwner }
