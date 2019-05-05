const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema

let todoSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    title: {type: String, required: true},
    created_at: {type: Date, required: true},
    status: Number,
    finished_at: {type: Date},
    description: {type: String},
    due_date: {type: String, required: true}
})

todoSchema.pre('save',function(next){
    let dateInput = moment(this.due_date)
    let now = moment()
    let diff = dateInput.diff(now, "days")
    if(diff< 0)throw new Error(`Date must be today or later!`)
    else{
        next()
    }
})

let Todo = mongoose.model('Todo', todoSchema)
Todo.schema.path("due_date").validate(function(value){
    console.log("validating duedate")
    let dateInput = moment(value)
    let now = moment()
    let diff = dateInput.diff(now, "days")
    if (diff<0)return false
    else{
        return true
    }
}, "Date mush be today or later!")


module.exports = Todo