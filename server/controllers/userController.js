const User = require("../models/user")
const Todo = require('../models/todo')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
class UserController {
    static create(req, res) {
        let newUser = new User({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        newUser.save()
            .then(created => {
                let newToken = jwt.sign({
                    id: created._id,
                    email: created.email,
                    username: created.username,
                    name: created.name
                }, process.env.JWT_KEY)
                res.status(201).json({
                    token: newToken
                })
            })
            .catch(err => {
                console.log(err.message);
                if (err.errors.email)console.log('anjay')
                res.status(500).json({
                    msg: err.message
                })
            })
    }
    static findAll(req, res) {
        let obj = {}
        let decode 
        if (req.query.id) {
            decode = jwt.verify(req.query.id,process.env.JWT_KEY)
            obj._id = decode.id
        }
        User.find(obj)
            .populate('todos')
            .then(users => {
                res.status(200).json(users)
            })
            .catch(err => {
                console.log(err.message)
                res.status(500).json({
                    msg: err.message
                })
            })
    }

    static delete(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                console.log(err.message)
                res.status(500).json({
                    msg: err.message
                })
            })
    }
    static login(req, res) {
        if (req.body.googleToken) {
            client.verifyIdToken({
                idToken: req.body.googleToken,
                audience: process.env.GOOGLE_CLIENT_ID
            })
                .then(ticket => {
                    const payload = ticket.getPayload()
                    User.findOne({ email: payload.email })
                        .then(user => {
                            if (user) {
                                let newToken = jwt.sign({
                                    id: user._id,
                                    name: user.name,
                                    username: user.username,
                                    email: user.email
                                }, process.env.JWT_KEY)
                                res.status(200).json({
                                    token: newToken
                                })
                            } else {
                                let newUser = new User({
                                    username: payload.given_name,
                                    name: payload.name,
                                    password: 123456,
                                    email: payload.email
                                })
                                newUser.save()
                                .then(created => {
                                    let newToken = jwt.sign({
                                        id: created._id,
                                        name: created.name,
                                        username: created.username,
                                        email: created.email
                                    }, process.env.JWT_KEY)
                                    res.status(201).json({
                                        token: newToken
                                    })
                                })
                            }
                        })
                    })
                .catch(err => {
                    console.log(err.message)
                    res.status(500).json({
                        msg: err.message
                    })
                })
        } else {
            User.findOne({ email: req.body.email }, '+password')
                .then(user => {
                    if (user) {
                        let check = bcrypt.compareSync(req.body.password, user.password)
                        if (check) {
                            let newToken = jwt.sign({
                                id: user._id,
                                name: user.name,
                                username: user.username,
                                email: user.email
                            }, process.env.JWT_KEY)
                            res.status(200).json({
                                token: newToken
                            })
                        } else {
                            res.status(400).json({
                                msg: "Invalid email/passowrd"
                            })
                        }
                    } else {
                        res.status(400).json({
                            msg: "Invalid email/password"
                        })
                    }
                })
                .catch(err => {
                    console.log(err.message)
                    res.status(500).json({
                        msg: err.message
                    })
                })
        }
    }

}

module.exports = UserController