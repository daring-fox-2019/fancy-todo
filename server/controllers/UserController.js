const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {randomizer} = require('../helpers/randomizer')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {


    static async getAllUser(req,res) {
        try {
            const users = await User.find({})
            res.status(200).json(users)
        } catch (err) {
            console.log(err, 'err bagian getalluser');
            res.status(400).json(err)
        }
    }

    static async register(req, res) {
        try {
            const created = await User.create({...req.body})
            res.status(201).json(created)
        } catch (err) {
            console.log(err, 'bagian register');
            
            res.status(400).json(err)
        }
    }

    static async signInLocal(req, res) {
        try {
            let found = await User.findOne({email : req.body.email})
            if (found) {
                if (!bcrypt.compareSync (req.body.password, found.password)) {
                    res.status(400).json({message : 'Username/Password Invalid'})
                } else {
                    let {email, _id, firstName, lastName} = found
                    let token = jwt.sign({
                        id : _id,
                        email
                    }, process.env.JWT_SECRET)
                    req.headers.token = token

                    res.status(200).json({token, _id, firstName, lastName})
                }
            } else {
                res.status(400).json({message : 'Username/Password Invalid'})
            }
        } catch(err) {
            console.log(err, 'bagian local login');
            res.status(400).json(err)
        }
    }

    static signInGoogle (req, res) {        
        let payload = null
        let token = null;
        // console.log('sign in google')
        client.verifyIdToken({
            idToken: req.body.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then(ticket => {
            payload = ticket.getPayload();
            return User.findOne({ email: payload.email })
        })
        .then((user) => {
            if (!user) {
                // console.log('sign in if berhasil')
                let obj = {
                    firstName : payload.name,
                    lastName : payload.name,
                    email: payload.email,
                    password : randomizer()
                }
                return User.create(obj)
                .then((newUser) => {
                    let { id, firstName, token } = newUser
                    token = jwt.sign({
                        id: newUser._id,
                        email: payload.email,
                        firstName : payload.name,
                    }, process.env.JWT_SECRET)
                    // console.log('dapet token jwt abis gogle', token)
                    res.status(201).json({token, id, firstName})
                })
                .catch(err => {
                    throw err
                })
            } else {
                token = jwt.sign({ id: user._id, firstName: user.firstName, email:user.email},
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                    );
                let id = user._id
                let firstName = user.firstName
                // console.log('ini token kalo udah daftar', token)
                req.headers.token = token

                res.status(200).json({token, id, firstName})
            }
        })
        .catch(err => {
            console.log('ini google error', err)
            res.status(500).json({ err})
        })
    }
}

module.exports = UserController