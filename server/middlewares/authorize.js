const Todo = require('../models/todo')

module.exports = {
    authorize : async function (req, res, next) {
        try {
            let found = await Todo.findById(req.params.todoId).populate('userId')
            if (found.userId._id.toString() == req.authenticatedUser.id) next()
            else res.status(401).json({message : 'You are not authorized to conduct this action'})            
        } catch (error) {
            console.log(error);
            
            res.status(400).json(error)
        }

    }
}