const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userModel = require('../model/user')
const todoModel = require('../model/todo')

const ProjectSchema = new Schema({
    name: {
        type : String,
        required : [true]
    },
    user_id : {
        type : Schema.Types.ObjectId, ref: 'User',
        required : [true]
    },
    task : {
        type : [{ type : Schema.Types.ObjectId, ref: 'Todo'}],
        required : [true]
    }
})

ProjectSchema.post('save', function(doc, next){
        const _id = doc.user_id
        const project_id = doc._id

        userModel.findOneAndUpdate({_id},{"$push": { "project_list":  project_id }}, { "new": true, "upsert": true },)
        .then( (data) => {
            next()
        })
        .catch(err => {
            next(err)
        }) 
})

ProjectSchema.post('findOneAndDelete', function(doc, next) {
 
    const project_id = doc._id

    todoModel.deleteMany({project_id})
    .then(() => {
        next()
    })
    .catch( err => {
        next(err)
    })

    userModel.update({project_list : doc._id}, {$pull : {project_list : doc._id}})
    .then( (data) => {
        next()
    })
    .catch(err => {
        console.log(err)
        next(err)
    })
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project