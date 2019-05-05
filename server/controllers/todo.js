
const Todo = require('../models/todo')
const Project = require('../models/project')

class TodoController {
    static async findAll(req,res) {
        try { 
            let found = await Todo.find({user: req.decoded._id, inProject: false})
            res.status(200).json(found)    
        }
        catch(err) {
            res.status(500).json(err)
        }
    }
    

    static findOne(req,res) {
        console.log('masuk ke findone')
        Todo.findOne({_id:req.params.id})
        .then(found => {
            res.status(200).json(found)
        })
        .catch(err => {
            res.status(500).json({
                message:'error findone todo',
                error: err,
            })
        })
    }

    static create(req,res) {
        const {name, description, dueDate} = req.body
        let obj_create = {name, description, dueDate}
        obj_create.createdAt = new Date();
        obj_create.user = req.decoded._id;
        obj_create.inProject = req.body.inProject || false;
        obj_create.status = false;
        // console.log('masukc create todo')
        // console.log(obj_create)
        Todo.create(obj_create)
        .then( created => {
            res.status(200).json(created)
        })
        .catch( err => {
            console.log(err)
            res.status(500).json({
                error: err,
                message: ' error when creating todo'
            })
        })
    }

    static updateOne(req,res) {
        Todo.findOneAndUpdate({
            _id: req.params.id
        }, {$set: req.body}, {new: true})
        .then(updated => {
            res.status(200).json(updated)
        })
        .catch(err => {
            res.status(500).json({
                message:'error findoneandupdate todo',
                error: err,
            })
        })
    }

    static deleteOne(req,res) {
        Todo.findOneAndDelete({
            _id: req.params.id
        })
        .then(updated => {
            res.status(200).json(updated)
        })
        .catch(err => {
            res.status(500).json({
                message:'error findoneandupdate todo',
                error: err,
            })
        })
    }

}

module.exports = TodoController