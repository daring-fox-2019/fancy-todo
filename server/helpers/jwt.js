const jwt = require('jsonwebtoken');

module.exports = {
    sign(input) {
        const token = jwt.sign(input, process.env.JWT_SECRET) //,{expiresIn: "1h"}
        return token;
    },
    verify(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            return decoded;
        }
        catch {
            throw new Error('token verify failed')
        }
    }
}