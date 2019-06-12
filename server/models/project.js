const mongoose   = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Project name is required']
    },
    master: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    todos: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }],
});

let Project = mongoose.model('Project', projectSchema);

module.exports = Project;
