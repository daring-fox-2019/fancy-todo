const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)
const { Schema } = mongoose;

const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: Boolean
    },
    due_date: {
        type: Date,
        required: [true, 'Due date is required']
    },
    owner : { type: Schema.Types.ObjectId, ref: 'User' }
});

todoSchema.pre('save',function(next, done) {  
    this.status = false
    next()
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo