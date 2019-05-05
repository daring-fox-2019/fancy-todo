jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function(req, res, next){
    // if(localStorage.getItem('token')){
    if(req.headers.hasOwnProperty('token')){
        console.log('sampe middleware')
        try{
            const decoded = jwt.verify(req.headers.token, proccess.env.SECRET_SAUCE)
            req.decoded = decoded
            next()
        } catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
}