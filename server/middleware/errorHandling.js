module.exports = function(err, req, res, next){
    console.log(err)
    switch(err.message){
        case 'Unauthenticate' : {
            res.status(400).json({message : 'Unauthenticate'})
            break;
        }
        case 'Unauthorize' : {
            res.status(400).json({message : 'Unauthorize'})
            break
        }
        case 'Not Found' : {
            res.status(400).json({message : 'Not Found'})
            break
        } 
        case `User already registered` : {
            res.status(400).json({ message : `User already registered`})
        }
        case `incorrect username/password` : {
            res.status(400).json({message : `incorrect username/password`})
        }
        case `user not yet registered` : {
            res.status(400).json({ message : `user not yet registered`})
        }
        default : {
            res.status(500).json({ message : err.message})
        }
    }
}