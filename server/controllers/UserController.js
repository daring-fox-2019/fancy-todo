const User = require('../models/user')
const Todo = require('../models/todo')
const Helper = require('../helpers/helper')

class UserController {
    static signup(req, res) {
        const {email, password} = req.body

        User.create({
            email, password
        })
        .then(user=> {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    }

    static list(req, res) {
        User.find({})
        .then(user=> {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(400).json(err)
        })
    }

    static signin(req, res) {
        const {email, password} = req.body

        User.findOne({
            email
        })
        .then(user => {
            if( Helper.comparePassword(password, user.password) ) {
                res.status(200).json(user)
            }else{
                res.status(200).json({msg: 'username/password wrong'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({err})
        })
    }

    static createToto(req, res) {
        const {name, description, status, due_date} = req.body

        Todo.create( {
            name,
            description,
            status,
            due_date,
            owner: req.params.userId
        } )
        .then(todo=> {
            res.status(201).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

module.exports = UserController
