const {
    OAuth2Client
} = require('google-auth-library')
let client = new OAuth2Client(process.env.CLIENT_ID)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const UserMod = User.User
const hashing = require('../helpers/hashingHelper')
const tokening = require('../helpers/tokenHelper')


module.exports = {
    auth: function (req, res) {
        let id_token = req.headers.id_token
        if (id_token) {
            // googleSignIn(req,res,id_token)
            client.verifyIdToken({
                    idToken: id_token,
                    audience: process.env.CLIENT_ID
                })
                .then(ticket => {
                    let payload = ticket.getPayload()
                    return User.findOne(payload.email)
                        .then((data) => {
                            if (!data) {
                                let name = payload.name
                                let email = payload.email
                                let password = hashing.generateHash("12345")
                                return User.create(name, email, password)
                                    .then(result => {
                                        let jwtoken = tokening.generateToken({
                                            name: result.name,
                                            _id: result._id,
                                            email: result.email
                                        })
                                        res.status(201).json(jwtoken)
                                    })
                            } else {
                                let jwtoken = tokening.generateToken({
                                    name: data.name,
                                    _id: data._id,
                                    email: data.email
                                })
                                res.status(200).json(jwtoken)
                            }
                        })
                })
                .catch((err) => {
                    res.status(500).json(err.message)
                })
        } else {
            let email = req.body.email
            let password = req.body.password
            User.findOne(email)
                .then(data => {
                    if (hashing.compareHash(password, data.password)) {
                        let jwtoken = tokening.generateToken({
                            name: data.name,
                            _id: data._id,
                            email: data.email
                        })
                        req.headers.jwtoken = jwtoken
                        res.status(200).json(jwtoken)
                    } else {
                        res.status(400).json('email/password salah')
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        }

    },
    register: function (req, res) {
        let name = req.body.name
        let email = req.body.email
        let pass = req.body.password
        if (!name || !email || !pass) {
            throw new Error('Please check your input!')
        }
        let password = hashing.generateHash(pass)
        User.create(name, email, password)
            .then(function (data) {
                res.status(201).json(data)
            })
            .catch(function (err) {
                res.status(400).json(err.message)
            })
    },
    update: function (id, field, value) {
        return User.update(id, field, value)
    },
    getAllUsers: function (req, res) {
        UserMod.find({})
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

}