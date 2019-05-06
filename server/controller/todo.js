const Todo = require('../models/todo-model')
const Window = require('window');
const window = new Window();

class Controller{
    static create(req,res){
        const {description,token} = req.body
        var base64Url = token.split('.')[1]
        var decodedValue = JSON.parse(window.atob(base64Url));
        Todo
            .create({
                description:description,
                owner:decodedValue.id
            })
            .then((todo) => {
                res.status(200).json({todo, msg: 'Success'})
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static read(req,res){
        Todo
            .find({
                owner:req.params.owner
            })
            .then(todo => {
                res.status(200).json({
                  todo: todo
                })
              })
            .catch(err => {
                res.status(500).json({
                  message: err.message
                })
            })
    }

    static update(req,res){
        Todo
            .updateOne({
                _id:req.params.id
            },
            {
                $set: {
                    description: req.body.description,
                }
            }
            )
            .then(() => {
                res.status(200).json({
                  message: "Success update task"
                })
              })
              .catch(err => {
                res.status(500).json({
                  message: err.message
                })
              })
    }
    
    static delete(req,res){
        Todo.deleteOne({
            _id:req.params.id
        })
        .then(() => {
            res.status(200).json({
              message: "Delete task success"
            })
          })
          .catch(err => {
            res.status(500).json({
              message: err.message
            })
          })
    }
}
module.exports = Controller