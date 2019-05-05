const User = require('../models/user')
const Todo = require('../models/todo')
const Helper = require('../helpers/helper')

class UserController {
    static signup(req, res) {        
        const {email, password, name} = req.body

        User.create({
            name, email, password
        })
        .then(user=> {
            console.log('-__________-');
            res.status(201).json(user)
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

        console.log('headers: ', req.headers);

        User.findOne({
            email
        })
        .then(user => {
            if(!user) {
                throw 'Username/password wrong'
            } else {
                if( Helper.comparePassword(password, user.password) ) {
                    let token = Helper.generateJWT({
                        email: user.email,
                        name: user.name,
                        id: user._id
                    });

                    let finalToken = {
                        token,
                        id: user._id,
                        name: user.name,
                        email: user.email
                    };

                    res.status(200).json(finalToken)
                }else{
                    throw 'Username/password wrong'
                }

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
            owner: localStorage.id
        } )
        .then(todo=> {
            res.status(201).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static findUserTodo(req, res) {
        const id=req.params.id

        Todo.find({owner:id})
        .then(todos=> {
            res.status(201).json(todos)
        })
        .catch(err => {
            res.status(500).json(err)
        })

    }
}

module.exports = UserController
