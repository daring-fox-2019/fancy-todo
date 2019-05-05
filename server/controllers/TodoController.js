const User = require('../models/user')
const Todo = require('../models/todo')
const calculateDate = require('../helpers/calculateDate')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'lutfii.dev@gmail.com',
           pass: '1412Dev!'
    }
});

class TodoController {
    static list(req, res) {
        Todo.find({owner: req.headers.id})
        .populate('owner', 'email')
        .then(todos=> {
            res.status(201).json(todos)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static findOne(req, res) {
        Todo.findOne({
            name: req.params.todoName
        })
        .then(todo => {
            console.log(todo);
            todo.deadline = calculateDate.inDays(todo.due_date, new Date() )

            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static create(req, res) {
        const {id, name, description, status, due_date} = req.body
        let todoCreate = ''

        Todo.create( {
            name,
            description,
            status,
            due_date,
            owner: id
        } )
        .then(todo=> {
            todoCreate = todo
            return User.findOne({id})
        })
        .then(user => {
            const mailOptions = {
                from: 'lutfii.dev@gmail.com',
                to: `${user.email}`,
                subject: '<fancy todo> You create a new todo',
                html: `
                <div>
                    <p>Congratulations!</p>
                    <p>
                        Your todo list: ${todoCreate.name} has been created
                    </p>
                </div>
                `
            };

            transporter.sendMail(mailOptions, function (err, info) {
            if(err) throw err
            });

            res.status(201).json(todoCreate)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static update(req, res) {
        const id = req.params.id

        Todo.findOneAndUpdate({_id: id}, {new: true})
        .then(todo => {
            console.log(todo);
            for(let key in req.body) {
                todo[key] = req.body[key]
            }

            todo.save()

            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static delete(req, res) {
        const id = req.params.id

        Todo.findOneAndDelete({_id: id})
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static search(req, res) {
        let nameREGEX = `^${req.query.name}`
        console.log(req.headers.id);
        Todo.
        find( 
            {
                $and:[
                    {name: { $regex: `${nameREGEX}`, $options: 'i' } }, 
                    {owner: req.headers.id  }
                ]
            }

        ).
        then(search=>{
            res.status(200).json(search);
        })
        .catch(err=> {
            console.log(err);
            res.status(400).json({'msg': 'Internal server error'})
        })
    }
}

module.exports = TodoController
