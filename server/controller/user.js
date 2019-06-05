const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

class Controller{
    static register(req,res){
        const {email,password} = req.body
        User
            .create({
                email:email,
                password:password
            })
            .then((user) => {
                res.status(200).json({user, msg: 'Success'})
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static login(req,res){
        const {email,password} = req.body
        User
            .findOne({
                email:email
            })
            .then((user) => {
                if(!user){
                    res.status(401).json({
                        message:'Wrong Email/Password'
                    })
                }
                else{
                    if(!bcrypt.compareSync(password,user.password)){
                        res.status(401).json({message : 'Wrong Email/Password'})
                    }
                    else{
                        const {id,email} = user
                        const payload = {id:id,email:email}
                        const token = jwt.sign(payload,process.env.JWT_SECRET)
                        req.headers.token = token
                        console.log(req.headers)
                        res.status(200).json({
                            message:"login success",
                            token:token,
                            details:payload
                        })
                    }
                }
            })
            .catch((err) => {
                res.status(500).json(err)
            }) 
    }

    static googleSign(req,res){
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: req.body.token,
                audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            // If request specified a G Suite domain:
            //const domain = payload['hd'];
            let token = jwt.sign(userid, process.env.JWT_SECRET)
            res.status(200).json(token)
          }
          verify().catch(err => {
              res.status(500).json(err)
          });
    }
}

module.exports = Controller