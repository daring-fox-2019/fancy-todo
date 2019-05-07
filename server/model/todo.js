
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
    task : {
        type : String,
        required : [true]
    },
    description : {
        type : String,
    },
    status : {
        type : String,
        required : [true]
    },
    due_date : {
        type : Date,
        required : [true]
    },
    user_id:{
        type : Schema.Types.ObjectId, ref: 'User',
        required : [true]
    },
    project_id: {
        type : Schema.Types.ObjectId, ref: 'Project'
    }
}, {timestamps: true} )


const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo