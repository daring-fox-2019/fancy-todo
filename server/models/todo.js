const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)
const { Schema } = mongoose;

const todoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String
    },
    due_date: {
        type: Date
    },
    owner : { type: Schema.Types.ObjectId, ref: 'User' }
});

todoSchema.pre('save',function(next, done) {  
    this.status = false
    next()
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo