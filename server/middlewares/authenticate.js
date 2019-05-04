const User = require('../models/user')
const jwt = require('../helpers/jwt')

module.exports = function(req, res, next) {
    let token = req.headers.authorization;
    if(token) {
        let decoded = jwt.verify(token);
        User
        .findOne({
            email: decoded.email
        })
        .then(user => {
            if(user) {
                req.user = user;
                next();
            } else {
                res.status(401).json('Invalid User');
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
    else {
        res.status(401).json('You must login to access this endpoint');
    }
}