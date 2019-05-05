const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
    name : {
        type : String,
        required : [true, 'Name must be filled']
    },
    members : [{type : Schema.Types.ObjectId, ref : 'User'}],
    pendingMembers : [{type : Schema.Types.ObjectId, ref : 'User'}],
    createdBy : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    todoList : [{type : Schema.Types.ObjectId, ref : 'Todo'}],
    messageList : [{
        date : {type : Date, default : new Date()},
        message : {type : String},
        userId : {type : Schema.Types.ObjectId, ref : 'User'}
    }]
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project