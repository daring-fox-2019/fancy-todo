const jwt = require('jsonwebtoken')

module.exports = function(req,res,next){
    if(req.headers.hasOwnProperty('token')){
        let decoded = jwt.verify(req.headers.token,`${process.env.SECRET_KEY}`)
        req.loggedUser = decoded
        // console.log(req.loggedUser)
        next()
    }
    else{
        res.status(401).json({
            msg: `you need to login first`
        })
    }
}