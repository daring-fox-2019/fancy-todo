const User = require('../models/userModel')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

class UserController {

    static async google(req, res) {
        try {
            
        const ticket = await client.verifyIdToken({
            
            idToken: req.body.token,
            audience: process.env.CLIENT_ID,  
        });
        const payload = ticket.getPayload();
    
        let user = await User.findOne({ email : payload.email})
                if (!user) {
                    let newUser = await User.create({
                        name : payload.name,
                        email: payload.email,
                        password : '12345'
                    })

                    let token = sign({
                        name : newUser.name,
                        email: newUser.email,
                        id : newUser._id
                    }, process.env.JWT_SECRET)
                    
                    req.headers.token = token
                    res.status(201).json({id : newUser._id, token, name : newUser.name})
                } else {
                   
                    let token = sign({
                        name : user.name,
                        email: user.email,
                        id : user._id 
                    }, process.env.JWT_SECRET)
                    
                    res.status(200).json({token, id: user._id, name: user.name })
                }
               
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static register(req, res) {
        User
        .create({
            name : req.body.name,
            email: req.body.email,
            password : req.body.password
        })
        .then((newUser) => {
            res.status(201).json({newUser, message : 'new user created!'})
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err)
        })
    }

    static login(req, res) {
        User
        .findOne({
            email : req.body.email
        })
        .then((user) => {
            if (!user) {
                res.status(404).json({message : 'user not found!'})
            } else if (!compare(req.body.password, user.password)) { 
                res.status(400).json({message: 'email/password is incorrect!'})
            } else {
                let payload = {
                    id : user._id,
                    email : user.email,
                    name : user.name
                }
                const token = sign(payload)
                req.headers.token = token
                res.status(200).json({token, payload, message : 'Welcome!'})
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)
        })
    }

    static showAll(req, res) {

        User
        .find()
        .then((users) => {
            res.status(200).json(users)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    }
}

module.exports = UserController