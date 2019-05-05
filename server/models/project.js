const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, "Project name is required"],
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  todos: [{
    type: Schema.Types.ObjectId,
    ref: "Todo",
  }],

  members: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;