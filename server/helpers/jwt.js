const jwt = require('jsonwebtoken')

module.exports = {
  sign: function (payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h'
    })
  },
  verify: function (token, res) {
    try {
      let result = jwt.verify(token, process.env.JWT_SECRET)
      return result
    } catch(err) {
      res.status(401).json({error: 'Token Expired'})
    }
  }
}