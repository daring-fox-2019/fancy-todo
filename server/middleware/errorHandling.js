module.exports = function(err, req, res, next){
    console.log(err)
    switch(err.message){
        case 'Unauthenticate' : {
            res.status(400).json(err)
            break;
        }
        case 'Unauthorize' : {
            res.status(400).json(err)
            break
        }
        case 'Not Found' : {
            res.status(400).json(err)
            break
        } 
        case `User already registered` : {
            res.status(400).json(err)
            break
        }
        case `incorrect username/password` : {
            res.status(400).json(err)
            break
        }
        case `user not yet registered` : {
            res.status(400).json(err)
            break
        }
        default : {
            res.status(500).json({ message : err.message})
        }
    }
}