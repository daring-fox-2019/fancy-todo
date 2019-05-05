const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'todo name is required']
    },
    description: String,
    status: Boolean,
    dueDate: Date,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: Date,
    inProject: Boolean,  
    project: {type: Schema.Types.ObjectId, ref: 'Project'}  
});
const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo
