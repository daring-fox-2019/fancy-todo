const Todo = require("./models/todomodel.js")
const User = require("./models/usermodel.js")
let objectId = require('mongodb').ObjectID;

const jwt = require('jsonwebtoken');

class Controller {
    static readAll(req, res) {
        Todo.find({}, null, {sort: "dueDate"}) //Closest due date first
        .then(todos => {
            // console.log(todos)
            res.json(todos)
        })
        .catch(err => {
            res.json({err})
        })
    }

    static notdone(req, res) {
        Todo.find({status: "notdone"}, null, {sort: "dueDate"})
        .then(todos => {
            res.json(todos)
        })
        .catch(err => {
            res.json({err})
        })
    }

    static done(req, res) {
        Todo.find({status: "done"}, null, {sort: "dueDate"})
        .then(todos => {
            res.json(todos)
        })
        .catch(err => {
            res.json({err})
        })
    }

    static readOne(req, res) {
        Todo.findById(objectId(req.params.id))
        .then(todo => {
            res.json(todo)
        })
        .catch(err => {
            res.json({err})
        })
    }

    static create(req, res) {
        let newtodo = new Todo({
            name: req.body.name,
            description: req.body.description,
            dueDate: req.body.dueDate,
        })
        console.log(newtodo)

        newtodo.save((err, todo) => {
            if(err){
                res.json({err})
            }
            res.json(todo)
        })
    }

    static delete(req, res) {
        Todo.deleteOne({_id: objectId(req.params.id)})
        .then(todo => {
            res.json(todo)
        })
        .catch(err => {
            res.json({err})
        })
    }

    static update(req, res) {
        const input = {}
        if(req.body.description) input.description = req.body.description
        if(req.body.status) input.status = req.body.status
        if(req.body.dueDate) input.dueDate = req.body.dueDate

        Todo.updateOne({_id: objectId(req.params.id)}, {$set: input})
        .then(todo => {
            res.json(todo)
        })
        .catch(err => {
            res.json({err})
        })
    }

    static newUser(req, res) {
        let newuser = new User({
            username: req.body.username,
            password: req.body.pass,
        })
        console.log(newuser)

        newuser.save((err, user) => {
            if(err) {
                res.json({err})
            }
            res.json(user)
        })
    }

    static login(req, res) {
        User.findOne({ username: req.body.username }, function(err, user) {
            if (err){
                res.json({err})
            }
        
            user.comparePassword(req.body.pass, function(err, isMatch) {
                if(err) {
                    res.json({err})
                }
                if(isMatch) {
                    let token = jwt.sign({
                        username: user.username
                    }, "krabbypattyformula", { expiresIn: '5d' });

                    res.json({
                        loggedIn: true,
                        token: token
                    })
                } 
                else {
                    res.json({
                        loggedIn: false
                    })
                }
            })
        })
    }
    static allUsers(req, res) {

    }

}

module.exports = Controller