const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please name your project'],
  },
  ownerID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  membersID: [],
  todosID: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Todo',
    },
  ],
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
