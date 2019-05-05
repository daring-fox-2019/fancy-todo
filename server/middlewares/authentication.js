const Helper = require('../helpers/helper')

module.exports = (err, req, res, next) => {
    const decoded = Helper.verifyJWT(req.headers.token);
    req.decoded = decoded
    req.headers.id = decoded.id

    next()
}