const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class Controller{
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