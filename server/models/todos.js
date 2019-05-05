const mongoose = require('mongoose')
const Schema = mongoose.Schema

let todoSchema = new mongoose.Schema({
    todo : String,
    start: Date,
    end: Date,
    description: String,
    location: String,
    status: String,
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
})

let ToDo = mongoose.model('ToDo', todoSchema)

module.exports = {
    ToDo,
    create: function(todo,start,end,description,location,status,user){
        return ToDo.create({todo,start,end,description,location,status,user})
    },
    findOne: function(id){
        return ToDo.findOne({_id:id})
    },
    findAll: function(id){
        return ToDo.find({user: id})
    },
    update: function(id, todo,start,end,description,location,status){
        return ToDo.updateOne({_id: id},{todo,start,end,description,location,status})
    },
    delete: function(id){
        return ToDo.deleteOne({_id:id})
    }
}