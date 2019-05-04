const mongoose = require('mongoose')
const Schema = mongoose.Schema

let projectSchema = new Schema({
    name: String,
    owner: {type: Schema.Types.ObjectId, ref:"User"},
    members: [{type: Schema.Types.ObjectId, ref:"User"}],
    todos: [{type: Schema.Types.ObjectId, ref:"Todo"}]
})

let Project = mongoose.model("Project", projectSchema)

module.exports = Project