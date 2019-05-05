const Todo = require('../models/todo')

module.exports = (err, req, res, next) => {
    if(req.headers.hasOwnProperty('token')) {
        Todo.findOne({owner:req.headers.id})
        .then((todo) => {
            if(todo) {
                if(todo.user_id===req.decoded.id) {
                    next()
                }else{
                    res.status(400).json([])
                }
            }
        })
        .catch(err => {
            res.status(500).json({'msg': 'Request error'})
        })
    }else {
        res.status(400).json({'msg': 'Not authorize'})
    }
}