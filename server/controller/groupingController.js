const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const grouping = require('../models/groupingModel')

class groupingController{
    static findAll(req,res){   
        let id = ObjectId(req.decoded.id)
        grouping
            .find({UserId:id})
            .then(groupings =>{
                res.status(200).json( { data: groupings } )
            })
            .catch( err => {
                res.status(404).json( { error: err } )
            })
    }
    static findOne(req,res){
        let groupingId = ObjectId( req.params.groupingId )
        grouping
            .findById ( groupingId )
            .populate('Todo')
            .then( grouping =>{
                if(grouping){
                    res.status(200).json( {data:grouping} )
                }else{
                    res.status(404).json({message:'not found'})
                }
            })
            .catch( err => {
                res.status(500).json( { error: err } )
            })
    }
    static delete(req,res){
        let groupingId = ObjectId(req.params.groupingId)
        grouping
            .findByIdAndDelete(groupingId)
            .then( deleted=>{
                if(deleted){
                    res.status(200).json({data:deleted})
                }else{
                    res.status(404).json({message:'not found'})
                }
            })
            .catch( err => {
                res.status(404).json( {error: err} )
            })
    }
    static update(req,res){
        let groupingId = ObjectId(req.params.groupingId)
        let input = req.body
        console.log(input)
        grouping
            .findById(groupingId)
            .then(user =>{
                user.set(input)
                return user.save()
            })
            .then(updated =>{
                res.status(200).json({data: updated})
            })
            .catch( error => {
                console.log(error)
                res.status(404).json({error: error})
            })
    }
    static updateTodoIdinGrouping(req,res){
        let GroupingId = ObjectId(req.params.GroupingId)
        let TodoId = ObjectId(req.params.TodoId)
        let addOrRemove = req.params.addOrRemove
        if(addOrRemove === 'add'){
            grouping
                .findByIdAndUpdate(GroupingId,
                    {$push:
                        {TodoId: TodoId}
                    },
                    {new:true},
                )
                .then( updatedGrouping =>{
                    res.status(200).json({data: updatedGrouping})
                })
                .catch( err => {
                    res.status(404).json({error: err})
                })
        }else if(addOrRemove === 'remove'){
            grouping
                .findByIdAndUpdate(GroupingId,
                    {$pull:
                        {TodoId: TodoId}
                    },
                    {new:true}
                )
                .then( updated => {
                    res.status(200).json( { data: updated } )
                })
                .catch( err => {
                    res.status(404).json({error: err})
                })
        }
    }
    static create(req,res){
        let id = ObjectId(req.decoded.id)
        let objInput = {
            title: req.body.title,
            description: req.body.description,
            UserId: id
        }
        grouping
            .create(objInput)
            .then(grouping=>{
                res.status(200).json({data:grouping})
            })
            .catch( error => {
                res.status(404).json({error: error})
            })
    }
}

module.exports = groupingController