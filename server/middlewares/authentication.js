const jwt = require("jsonwebtoken")

module.exports = {
    Authentication : function(req,res,next){
        let decode = jwt.verify(req.headers.token, process.env.JWT_KEY)
        if (decode)next()
        else if(!decode) throw new Error(`Not authentic`)
    }
}