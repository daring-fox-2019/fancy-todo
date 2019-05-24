const User = require('../models/user') 
const {compare} = require('../helpers/bcrypt')
const {sign} = require('../helpers/jwt')
const transporter = require('../helpers/nodemailer')

class UserController {
    static findAll(req,res) {
        let query_obj = {};
        if(req.query.email) {
            const {email} = req.query
            query_obj.email = email
        }
        // console.log(query_obj)
        User.find(query_obj)
        .then(found => {
            res.status(200).json(found)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static register(req,res) {
        console.log(req.body)
        
        User.create(req.body)
        .then(created => {
            const email_obj = {
                from: 'michaelrs.mailer@gmail.com',
                subject: "Welcome " + created.name,
                html: `<p>Welcome ${created.name} to Fancy Todo<!/p><p>Thank you for signing up!</p>`,
                to: created.email,
            }
            transporter.sendMail(email_obj, function(error, info) {
                if(error) {
                    return console.log(error)
                } else {
                    res.status(200).json(created)
                    done ()
                }
            })
            res.status(200).json(created)
        })
        .catch(err => {
            console.log(err.errors.email.message)
            res.status(500).json({
                message: 'failed to create new user',
                error: err.errors.email.message,
            })
        })
    }

    static login(req,res) {
        const {email, password} = req.body
        User.findOne({email})
        .then(found => {
            if(found) {
                // console.log(found)
                if(compare(password, found.password)) {
                    const to_be_signed = {
                        _id: found._id,
                        email:found.email,
                        name: found.name,
                    }
                    
                    const token = sign(to_be_signed)
                    res.status(200).json({
                        message:'successfully logged in',
                        token: token,
                        user: to_be_signed,
                    })

                } else {
                    res.status(400).json({
                        message: 'invalid username/password'
                    })
                }
            } else {
                res.status(400).json({
                    message: 'invalid username/password'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'error login user',
                error: err.message,
            })
        })
    }


    static googleLogin(req,res) {
        // console.log(req.payload)
        const {email} = req.payload
        User.findOne({email})
        .then(found => {
            if(found) {
                const to_be_signed = {
                    _id: found._id,
                    email:found.email,
                    name: found.name,
                }
                const token = sign(to_be_signed)
                res.status(200).json({
                    message:'successfully logged in with google',
                    token: token,
                    user: to_be_signed,
                })
            } else {
                const {name, email, picture} = req.payload
                const password =  Math.random().toString(36).substr(2,10);
                User.create({email, name, picture, password})
                .then(created => {
                    const to_be_signed = {
                        email: created.email,
                        name: created.name,
                        picture: created.picture,
                    }

                    const token = sign(to_be_signed);

                    res.status(201).json({
                        message:'successfully logged in with google',
                        token: token,
                        user: to_be_signed,
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message:'error registering user - google login',
                        error: err,
                    })
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message:'error google login user',
                error: err,
            })
        })

    }

}

module.exports = UserController