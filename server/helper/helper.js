const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = {
    generateHashPass(pass){
        return bcrypt.hashSync(pass, +process.env.SALT)
    },
    generateJWT(obj){
        return jwt.sign({name: obj.name, email:obj.email, id: obj.id}, process.env.JWT_KEY, {expiresIn: 4 * 3600})
    },
    compareHash(pass, passDB){
        return bcrypt.compareSync(pass, passDB)
    },
    decodeJWT(token){
        try{
            return jwt.verify(token, process.env.JWT_KEY)
        } catch(err){
            throw new Error(err)
        }
        
    }
}