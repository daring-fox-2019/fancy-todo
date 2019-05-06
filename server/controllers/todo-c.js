const Todo = require('../models/todo')
const { ObjectID } = require('mongodb')

class ControllerTodo{
  static newTodos(req,res){
    let newTodo = {
      user : new ObjectID(req.headers.id),
      name : req.body.name,
      description : req.body.description,
      status : "not done",
      due_date : req.body.due_date
    }
    console.log(newTodo)
    Todo.create(newTodo)
    .then(result=>{
      res.json("success")
    })
    .catch(err=>{
      res.json({error : err.message})
    })
  }

  static viewAllTodos(req,res){
    let condition = {
      user : new ObjectID (req.headers.id)
    }

    Todo.find(condition)
    .then(results=>{
      if(results) {
        res.json(results)
      } else {
        res.json(null)
      }
    })
    .catch(error=>{
      res.json({error : error.message})
    })
  }

  static viewOneTodo(req,res){
    let condition = {
      _id : new ObjectID (req.params.id)
    }

    Todo.findOne(condition)
    .then(result=>{
      console.log(result)
      if(result) {
        res.json(result)
      } else {
        res.json("not found")
      }
    })
    .catch(error=>{
      res.json({error : error.message})
    })
  }

  static deleteOneTodo(req,res){
    let condition = {
      _id : new ObjectID (req.params.id)
    }

    Todo.findByIdAndDelete(condition)
    .then(result=>{
      if(result) {
        res.json("success")
      } else {
        throw { error : { message : "not exists" } }
      }
    })
    .catch(error=>{
      res.json({error : error.message})
    })
  }

  static updateOneTodo(req,res){
    let condition = {
      _id : new ObjectID (req.params.id)
    }
    Todo.findOne(condition)
    .then(result=>{
      if(result) {
        let todo = new Todo(result)
        if(req.body.name != "" && req.body.name){
          todo.name = req.body.name
        }
        if(req.body.description != "" && req.body.description){
          todo.description = req.body.description
        }
        if(req.body.status != "" && req.body.status){
          todo.status = req.body.status
        }
        if(req.body.due_date != "" && req.body.due_date){
          todo.due_date = new Date(req.body.due_date)
        }
        console.log(req.body)
        console.log("todo === ",todo)
        return todo.save()
      } else {
        console.log("ga ada")
        throw { error : { message : "not exists" } }
      }
    })
    .then(updated=>{
      console.log("akhir update")
      res.json("success")
    })
    .catch(error=>{
      console.log(error)
      console.log("error disini")
      res.json({error : error.message})
    })
  }

}
module.exports = ControllerTodo