const jwt = require('jsonwebtoken')

module.exports = {
    generateToken(data) {
        return jwt.sign({
            data
        }, process.env.JWT_SECRET)
    },
    decodeToken(data) {
        return jwt.verify(data, process.env.JWT_SECRET).data
    }
}