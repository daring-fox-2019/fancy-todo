const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = {
    authenticate : function (req, res, next) {
        
        console.log(req.headers.token, 'apakah dapet token???')
        if (req.headers.token) {
            try {
                const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
                req.authenticatedUser = decoded
                console.log(req.authenticatedUser);
                next()
            } catch (error) {
                res.status(401).json('Invalid token')
            }

        } else {
            res.status(400).json({message : 'You are not logged in'})
        }
    }
}