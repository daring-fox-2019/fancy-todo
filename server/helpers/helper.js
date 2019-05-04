const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = {
    hashPassword(password){
        return bcrypt.hashSync(password, +process.env.SALT)
    },
    comparePassword(password, passwordDB){
        return bcrypt.compareSync(password, passwordDB)
    },
    generateJWT(userPayload){
        return jwt.sign(userPayload, process.env.JWT_SECRET, {expiresIn: '1h'})
    },
    verifyJWT(token){
        return jwt.decode(token, process.env.JWT_SECRET)
    }
}