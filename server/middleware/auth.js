const Helper = require('../helper/helper')

module.exports = function(req, res, next){

    if(req.headers.token){
        let decode = Helper.decodeJWT(req.headers.token)
        console.log(decode,'================================')
        req.headers.id = decode.id
        next()
    } else {
        next({message : 'Unauthenticate'})
    }
}