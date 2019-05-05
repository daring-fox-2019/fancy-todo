const bcrypt = require('bcryptjs')

module.exports = {
    generateHash(pass){
        return bcrypt.hashSync(pass,8)
    },
    compareHash(pass,hash){
        return bcrypt.compareSync(pass,hash)
    }
}