const Helper = require('../helpers/helper')

module.exports = (err, req, res, next) => {
    try {
        const decoded = Helper.verifyJWT(req.headers.token);
        req.decoded = decoded
        req.headers.id = decoded.id
        next()
    } catch (err) {
        res.status(500).json(err)
    }

}