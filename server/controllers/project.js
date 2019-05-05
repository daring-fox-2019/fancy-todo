const Project = require('../models/project')

class ProjectController {
    static create(req,res) {
        req.body.createdBy = req.decoded._id
        req.body.members = req.decoded._id

        Project.create(req.body)
        .then(created => {
            res.status(201).json(created)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error creating project',
                error: err,
            })
        })
    }

    static findAll(req,res) {
        Project.find({members: req.decoded._id})
        .populate('members', ['name', 'email'])
        .populate('todos')
        .populate('createdBy', ['name', 'email'])
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static findOne(req,res) {
        Project.findOne({_id: req.params.id, members: req.decoded._id})
        .populate('members', ['name', 'email'])
        .populate('todos')
        .populate('createdBy', ['name', 'email'])
        .then(found => {
            res.status(200).json(found)
        })
        .catch(err => {
            res.status(500).json({
                message:'error when findone projects',
                error: err,
            })
        })
    }

    static deleteOne(req,res) {
        Project.findOneAndDelete({_id: req.params.id})
        .then(deleted => {
            res.status(200).json({
                message:'success deleting project ' + req.params.id 
            })
        })
        .catch(err => {
            res.status(500).json({
                message:'error when deleting project',
                error: err,
            })
        })
    }


    static updateOne(req,res) {
        let update_obj;
        if(req.body.addMember) {
            update_obj = {$push: {members: req.body.addMember}}
        } else if(req.body.addTodo) {
            update_obj = {$push: {todos: req.body.addTodo}}
        } else if(req.body.deleteMember) {
            // console.log('masuk sini delete member patch')
            update_obj = {$pull: {members: req.body.deleteMember}}
            // console.log(update_obj)
        } else if (req.body.deleteTodo) {
            update_obj = {$pull: {todos: req.body.deleteTodo}}
        } else {
            update_obj = req.body
        }

        Project.findOneAndUpdate({_id: req.params.id}, update_obj, {new:true, runValidators: true})
        .then(updated => {
            res.status(200).json(updated)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error update projects',
                error: err.message,
            })
        })
    }

}

module.exports = ProjectController;