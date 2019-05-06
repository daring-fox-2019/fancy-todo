const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class Controller{
    static GoogleSignIn(req, res){  
        let payload = null;
        client.verifyIdToken({
            idToken: req.body.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then((ticket) => {
            payload = ticket.getPayload();
            const userid = payload['sub'];
            console.log(ticket);
            return User.findOne({ email : payload.email})
        })
        .then((user) => {
            if(user){
                let userName = user.userName
                let payload = {
                    userName: user.userName,
                    email: user.email
                }
                let token = jwt.sign(payload, process.env.API_KEY)
                console.log('token --->',token, '<---token')
                res.status(200).json({token, userName})
            }else{
                return User.create({
                    userName: payload.name,
                    email: payload.email,
                    password: "123456"
                })
                .then((user) => {
                    let userName = user.userName
                    let payload = {
                        userName: user.userName,
                        email: user.email
                    }
                    let token = jwt.sign(payload, process.env.API_KEY)
                    console.log('token --->',token, '<---token')
                    res.status(200).json({token, userName})
                })
                .catch((err) => {
                    res.status(500).json(err)
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)
        })
    }
    static Register(req, res){
        User
        .create({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        })
        .then(regis => {
            User
            .findOne({
                email: regis.email
            })
            .then(login => {
                if(login){
                    let {userName} = login
                    let payload = {
                        userName: login.userName,
                        email: login.email,
                        password: login.password
                    }
                    let token = jwt.sign(payload, process.env.API_KEY)
                    console.log('token regis-->',token)
                    res.status(200).json({token, userName})    
                }else{
                    res.status(404).json({
                        msg: "Not Found"
                    })
                }
            })
            .catch(err => {
                res.status(404).json({
                    msg: "Not Found"
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                msg: "Internal Server Error",
                err: "Email Already Used"
            })
        })
    }

    static Login(req, res){
        User
        .findOne({
            email: req.body.email
        })
        .then(login => {
            if(login){
                let {userName} = login
                let payload = {
                    userName: login.userName,
                    email: login.email,
                    password: login.password
                }
                let token = jwt.sign(payload, process.env.API_KEY)
                console.log('token login-->',token)
                res.status(200).json({token, userName})    
            }else{
                res.status(404).json({
                    msg: "Not Found"
                })
            }
        })
        .catch(err => {
            res.status(404).json({
                msg: "Not Found"
            })
        })
    }
}

module.exports = Controller