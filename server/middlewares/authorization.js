const jwt = require('jsonwebtoken')
const Todo = require('../models/todo')
module.exports = {
    Authorization : function(req,res,next){
        let user = jwt.verify(req.headers.token, process.env.JWT_KEY)
        Todo.findById(req.params.id)
        .then(todo=>{
            console.log(todo.owner)
            if(String(todo.owner) === user.id)next()
            else{
                throw new Error(`Not authorized`)
            }
        })
    }
}