const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    name: {
        type : String,
        required : [true]
    },
    user_id : {
        type : Schema.Types.ObjectId, ref: 'User',
        required : [true]
    },
    task : {
        type : [{ type : Schema.Types.ObjectId, ref: 'Todo'}],
        required : [true]
    }
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project