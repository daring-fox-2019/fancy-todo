
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


module.exports = {
    googleVerify(req, res, next) {

        client.verifyIdToken({
            idToken: req.body.token,
            audience: CLIENT_ID,
        })
        .then( ticket => {
            const payload = ticket.getPayload();
            req.payload = payload
            // console.log('masuk middlewares google login')
            // console.log(req.payload)
            // console.log(payload)
            next()
        })
        .catch(err => {
            res.status(400).json({
                message:'please provide google token'
            })
        })
    }
}