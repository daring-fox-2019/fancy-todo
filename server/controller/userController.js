const User = require('../models/userModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config

class userController{
    static findLoggedUser(req,res){
        let id = ObjectId(req.decoded.id)
        User
            .findById(id)
            .then( user =>{
                res.status(200).json({ data: user})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }

    static findOtherUser(req,res){
        let id = ObjectId(req.params.userId)
        User
            .findById(id)
            .then(user=>{
                res.status(200).json({data: user})
            })
            .catch(err =>{
                res.status(404).json({error: err})
            })
    }
    
    static deleteUser(req, res){
        let id = ObjectId(req.decoded.id)
        User   
            .findOneAndDelete({ id : id })
            .then( deletedUser => {
                res.status(200).json({data: deletedUser})
            })
            .catch( err => {
                res.status(404).json({error: err})
            })
    }

    static updateInfoUser(req,res){
        let id = ObjectId(req.decoded.id)
        User
            .findById(id)
            .then(user =>{
                user.set(req.body)
                return user.save()
            })
            .then(updatedUser =>{
                res.status(200).json({data: updatedUser})
            })
            .catch(err => {
                res.status(404).json({error: err})
            })
    }

    static signin(req, res){
        let username= req.body.username
        User
            .findOne({username:username})
            .then((oneUser)=>{
                if(oneUser){
                    if(bcrypt.compareSync(req.body.password, oneUser.password)){
                        let payload = {
                            id : oneUser.id,
                            username : oneUser.username
                        }
                        let token = jwt.sign(payload, kalduayam)//process.env.SECRET_SAUCE) //don't forget to use .env
                        res.json({
                            data: oneUser,
                            token: token
                        })
                    } else {
                        res.status(400).json({msg: 'password/user wrong'})
                    }
                }else{
                    res.status(400).json({msg:'password/user wrong'})
                }
            })
            .catch((err)=>{
                console.log(err)
                res.status(404).json({error:err})
            })
    }

    static signup(req, res){
        let inputObj = {
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        }
        User
            .create(inputObj)
            .then((newUser)=>{
                res.status(200).json(newUser)
            })
            .catch( err => {
                res.status(400).json({error: err})
            })
    }
    
}

module.exports =  userController