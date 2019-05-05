const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Task name cannot be empty']
    },
    description: {
        type: String,
        required: [true, 'Description must be filled']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date for task must be filled'],
    },
    status: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enum: ['personal', 'project'],
        default: 'personal'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }
}, {
    timestamps: true
})

const Todo = mongoose.model("Todo", todoSchema)
module.exports = Todo