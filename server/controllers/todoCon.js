const Todo = require('../models/todo')

class Todos{
    static addTodo(req, res){
    Todo
    .create({
        userName: req.body.userName,
        todo : req.body.todo
    })
    .then((result) => {
        res.status(201).json({result})
    })
    .catch((err) => {
        res.status(500).json({err})
    })
    }
}

module.exports = Todos