const mongoose = require('mongoose')
const { Schema } = mongoose

const TodoSchema = new Schema({
  user : { type: Schema.Types.ObjectId, ref: 'User' },
  name : String,
  description : String,
  status : String,
  due_date : {
    type : Date,
    validate : {
      validator : function(due_date){
          const input = new Date(due_date);
          const today = new Date();         
          return input > today
      },
      message : "date must be later than today"
    }
  },
})

const Todos = mongoose.model('Todo', TodoSchema)
module.exports = Todos