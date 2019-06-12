const User             = require('../models/user');
const { decrypt }      = require('../helpers/bcrypt');
const { sign }         = require('../helpers/jwt');
const generatePassword = require('../helpers/password-generator');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID        = process.env.CLIENT_ID
const client           = new OAuth2Client(CLIENT_ID);

class UserController {
    static register(req, res) {
        User
            .create(req.body)
            .then(newUser => {
                res
                    .status(201)
                    .json(newUser);
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    });
            });
    }

    static login(req, res) {
        User
            .findOne({
                email: req.body.email
            })
            .then(foundUser => {
                if (!foundUser) {
                    res
                        .status(404)
                        .json({
                            message: 'User not found'
                        });
                } else {
                    if (decrypt(req.body.password, foundUser.password)) {
                        const token = sign(foundUser._id, foundUser.name);

                        res
                            .status(200)
                            .json({
                                accesstoken: token
                            });
                    } else {
                        res
                            .status(401)
                            .json({
                                message: 'Wrong password'
                            });
                    }
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        message: err.message
                    });
            });
    }

    static verify(req, res) {
        let payload;
        let token;
        
        client
            .verifyIdToken({
                idToken: req.body.token,
                audience: CLIENT_ID,
            })
            .then(ticket => {
                payload = ticket.getPayload();
                const userid = payload['sub'];
                
                return User.findOne({ 
                    email: payload.email
                })
            })
            .then(user => {
                if (!user) {
                    return User.create(
                        { 
                            name: payload.name,
                            email: payload.email,
                            password: generatePassword()
                        }
                    );
                } else {
                    return user
                }
            })
            .then(newUser => {
                token = sign(newUser._id, newUser.name);

                res
                    .status(200)
                    .json({
                        accesstoken: token
                    });
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                    message: err.message
                });
            });
    }
}

module.exports = UserController;
