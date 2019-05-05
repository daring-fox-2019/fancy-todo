const mongoose = require('mongoose')
const Schema = mongoose.Schema

let projectSchema = new mongoose.Schema({
    project : {type:String, required: true},
    description: {type:String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    members: [{type: Schema.Types.ObjectId, ref:'User'}],
    todos: [{type: Schema.Types.ObjectId, ref: 'ToDo'}],
})

let Project = mongoose.model('Project', projectSchema)

module.exports = {
    Project,
    create: function(project,description,owner,members,todos){
        return Project.create({project,description, owner, members,todos})
    },
    findOne: function(id){
        return Project.findOne({_id:id})
    },
    findAll: function(userId){
        return Project.find({members: userId}).populate('owner').populate('members').populate('todos')
    },
    update: function(id, project,description,owner,members,todos){
        return Project.updateOne({_id: id},{project,description, owner, members})
    },
    delete:function(id){
        return Project.deleteOne({_id:id})
    }
}


