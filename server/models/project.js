const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectSchema = new Schema({
    name: String,
    members: [{type: Schema.Types.ObjectId, ref: 'User',
    validate: {
        validator(members) {
            // console.log(members)
            // console.log(this._conditions)
            // console.log("hahhaahhhahaha")
        }
    }}],
    pendingMembers: [{
        type: Schema.Types.ObjectId, 
        ref:'User'
    }],
    todos: [{type: Schema.Types.ObjectId, ref: 'Todo'}],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    description: String,
});

projectSchema.pre('findOneAndUpdate', function(next) {
    // console.log('masuk pre')
    const update = this._update
    if(update.$push) {
        //double if --> deep object if else js handle?
        //if not double if -->  error
        if(update.$push.members) {
            return Project.findOne({_id: this._conditions._id, members: update.$push.members})
            .then(found => {
                if(found) next(new Error('user is already registered as project member')) 
                else {
                    next()
                }
            })
        }
    }
    next()
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project;