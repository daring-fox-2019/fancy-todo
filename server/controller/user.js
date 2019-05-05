const userModel = require('../model/user')
const Helper = require('../helper/helper')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_GOOGLE);

class User{
    static createUser(req, res, next){
        const {name, email, password} = req.body

        userModel.create({name , email, password})
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(500).json({message : err.message})
        })
    }

    static postLogin(req, res, next){
        const {email, password} = req.body

        userModel.findOne({email})
        .then(data => {
            if(data){
                if(Helper.compareHash(password, data.password)){
                    let token = Helper.generateJWT({name : data.name, id:data._id, email: data.email})
                    res.status(200).json({token, email:data.email})
                } else {
                    next({message : `incorrect username/password`})
                }
            } else {
                next({message : `user not yet registered`})
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static patchUpdate(req, res, next){
        const _id = req.headers.id
        const { email, password, project_id} = req.body

        let obj = {}

        if(project_id){
            obj = {"$push": { "project_list":  project_id }}
        }

        if(email){
            obj.email = email
        }

        if(password){
            obj.password = password
        }

        userModel.findOneAndUpdate({_id},obj, { "new": true, "upsert": true },)
        .then( (data) => {
            res.status(200).json(data)
        })
        .catch(err => {
            next(err)
        }) 
    }

    static getOneUser(req, res, next){
        const _id = req.headers.id

        userModel.findOne( {_id} ).select({ 'name' : '0', 'email' : '0', 'project_list' : '0'})
        .populate(
        { 
            path : 'project_list',
        })
        .then( data => {
            res.status(200).json(data)
        })
        .catch(err => {
          
            next(err)
        })
    }

    static getAllUser(req, res, next){
        const _id = req.headers.id
        const { project_id } = req.headers
        let obj = {}

        if(project_id){
            obj = { project_list : project_id }
        }

        userModel.find(obj).select({ 'name' : '0', 'email' : '0', 'project_list' : '0'})
        .populate(
        { 
            path : 'project_list',
        })
        .then( data => {
         
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
    }

    static googleSignIn(req, res, next){
        let payload
      
        client.verifyIdToken({
            idToken: req.body.id_token,
            audience: process.env.CLIENT_GOOGLE
        })
        .then(ticket => {
            payload = ticket.getPayload()

            return userModel.findOne({ email : payload.email})
        })
        .then( user => {
            if(user){
                let token = Helper.generateJWT({name : user.name, email: user.email, id:user._id})
                res.status(200).json({token , email:user.email, name:user.name})
            } else {
                userModel.create({name : payload.name, email: payload.email, password: process.env.PASSWORD})
                .then( userData => {
                    let token = Helper.generateJWT({name : userData.name, email: userData.email, id:userData._id})
                    res.status(200).json({token , email:userData.email, name:userData.name})
                })
                .catch(err => {
                    next(err)
                })
            }
        })
        .catch( err =>{
            console.log(err)
            next(err)
        })
    }
}

module.exports = User