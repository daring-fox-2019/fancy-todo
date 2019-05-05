const Project = require('../models/project')
const Todo = require('../models/todo')
const User = require('../models/user')
const nodemailer = require('../helpers/nodemailer')
const baseURL = `http://localhost:3000`
const qs = require('qs')


class ProjectController {

    static async create(req, res) {
        try {
            let created = await Project.create({
                ...req.body,
                createdBy: req.authenticatedUser.id
            })
            let pushedCreatorAsMember = await Project.findByIdAndUpdate(created._id, {$push : {members : req.authenticatedUser.id}}, {new : true})
            res.status(201).json(pushedCreatorAsMember)
        } catch (error) {
            console.log(error, 'bikin projekny');
            res.status(500).json(error)
        }
    }

    static async inviteMembers(req, res) {
        try {
            let foundUserByEmail = await User.findOne({email : req.body.email})
            if (!foundUserByEmail) {
                res.status(404).json({msg : `${req.body.email} is not registered!`})
                throw new Error
            }

            let data = await Project.findById(req.params.projectId)
            // console.log(data, 'dapet aapa');
            // console.log(foundUserByEmail, 'dapet aapa');

            let checkMember = data.members.indexOf(foundUserByEmail._id) < 0
            let checkpendingMembers = data.pendingMembers.indexOf(foundUserByEmail._id) < 0

            // console.log(checkMember, checkpendingMembers), '/?/?';
            if (checkMember && checkpendingMembers) {
                data.pendingMembers.push(foundUserByEmail._id)
                await data.save()

                let textToSend = `
                    Good Day ${foundUserByEmail.firstName} ${foundUserByEmail.lastName}.
                    ${req.authenticatedUser.email} is inviting you to collaborate on ${data.name} Project.
                    If you wish you join the team and collaborate please go to your account on our website and check your pending invitations.
                    Otherwise, you can always decline ${req.authenticatedUser.email}'s invitation from your profile.
                    Have a great day.


                    Cheers, Produktivv.
                `
                nodemailer(req.body.email, textToSend)

                res.status(200).json(data)
            } else if (!checkMember) {
                res.status(400).json({msg : "User already a members"})
            } else if( !checkpendingMembers) {
                res.status(400).json({msg : "User already invited"})
            }
        } catch (error) {
            // console.log(error, 'invit2');
            res.status(500).json(error)
        }
    }

    static async acceptProject(req, res) {
        try {
            let updated = await Project.findByIdAndUpdate(req.params.projectId,
                {$pull: {pendingMembers: req.authenticatedUser.id}, $addToSet: {members: req.authenticatedUser.id}}, {new : true})
            res.status(200).json(updated)
        } catch (error) {
            console.log('error acc projek', error);
            res.status(500).json(error)
        }
    }

    static async declineProject(req, res) {
        try {
            let updated = await Project.findByIdAndUpdate(req.params.projectId,
                {$pull: {pendingMembers: req.authenticatedUser.id}}, {new : true})
            res.status(200).json(updated)
        } catch (error) {
            console.log('error tolak projek', error);
            res.status(500).json(error)
        }
    }
    static async createTodoForThisProject(req,res) {        
        try {
           let foundUserByEmail = await User.findOne({email : req.body.email}) 
           let createdTodo = await Todo.create({...req.body, type : 'project', userId : foundUserByEmail._id, projectId : req.params.projectId})
           let updatedProject = await Project.findByIdAndUpdate(req.params.projectId, {$push : {todoList :createdTodo._id}}, {new : true})
           if (!updatedProject) res.status(404).json({message : 'No such project to be added with new todo!'})
           else {
               console.log('berhasil buat todod di projek');
               res.status(201).json(updatedProject)
           }
           
        } catch (error) {
            console.log(error, 'bikin todo di proje');
            res.status(500).json(error)
        }
    }

    static async deleteTodoInThisProject(req, res) {
        console.log(req, 'isi req apa delete');  
        try {
            let foundTodo = await Todo.findByIdAndRemove(req.params.todoId)
            console.log(foundTodo, 'ketmu?');
            
            if (foundTodo) {
                let updatedProject = await Project.findByIdAndUpdate(req.params.projectId, {$pull : {todoList :foundTodo._id}}, {new : true})
                res.status(200).json(foundTodo)
            } else {
                res.status(404).json({msg : 'No such Todo found in this project'})
            }
        } catch (error) {
            console.log(error, 'deleting todo di proje');
            res.status(500).json(error)

        }
    }

    static async editTodoInThisProject(req, res) {
        try {
            let foundTodo = await Todo.findByIdAndUpdate(req.params.todoId, {$set : {...req.body}}, {new : true})
            res.status(200).json(error)
        } catch (error) {
            res.status(500).json(error)
        }
    } 

    static async quitProject(req, res) {
        try {
            let updated = await Project.findByIdAndUpdate(req.params.projectId,
                {$pull: {members: req.authenticatedUser.id}}, {new : true})
            res.status(200).json(updated)

        } catch (error) {
            console.log('saya quit member eror', error);
            res.status(500).json(error)
        }
    }


    static async deleteMember(req,res) {
        try {
            let updatedAndDeleted = await Project.findByIdAndUpdate(req.params.projectId, {$pull: {members: req.params.memberId}}, {new : true})
            await Todo.deleteMany({projectId : req.params.projectId})
            res.status(200).json(updatedAndDeleted)
        } catch (error) {
            console.log('delet member eror', error);
            res.status(500).json(error)
        }
    }
    static async updateProject(req, res) {
        try {
            let updated = await Project.findByIdAndUpdate(req.params.projectId, {
                $set: { ...req.body }
            }, { new: true })
            if (updated) res.status(200).json(updated)
            else res.status(400).json({
                message: 'No such project found'
            })
        } catch (error) {
            console.log(error, 'bagian update project');
            res.status(500).json(error)
        }
    }

    static async deleteProject(req, res) {
        try {
            let deleted = await Project.findByIdAndRemove(req.params.projectId)
            let deletedRelatedTodo = await Todo.deleteMany({projectId : req.params.projectId})
            
            if (deleted) res.status(200).json(deleted)
            else res.status(400).json({
                message: 'No such project found'
            })
        } catch (error) {
            console.log(err, 'bagian delete projek');

            res.status(500).json(error)
        }
    }

    static async findOne(req, res) {
        try {
            //where array memebrnya $in gue
            let found = await Project.findById(req.params.projectId).populate('pendingMembers').populate('members').populate('createdBy').populate({path : 'messageList.userId', model : 'User'})
            if (found) res.status(200).json(found)
            else res.status(400).json({
                message: 'No such project found'
            })
        } catch (error) {
            console.log(error, 'bagian find one projek');
            res.status(500).json(error)
        }
    }

    static async findAll(req, res) {
        try {
            let foundProjectByLoggedInUser = await Project.find({members : {$in : req.authenticatedUser.id}}).populate('pendingMembers').populate('createdBy').populate({path : 'todoList', model : 'Todo', populate : {path : 'userId', model : 'User'}}).populate('members')
            res.status(200).json(foundProjectByLoggedInUser)
        } catch (error) {
            console.log(error, 'bagian find all projek');
            res.status(500).json(error)
        }
    }

    static async findMemberInAnyPendingMembers(req, res) {
        try {
            let foundMemberAsPendingMember = await Project.find({pendingMembers : {$in : req.authenticatedUser.id}})
            if (foundMemberAsPendingMember) res.status(200).json(foundMemberAsPendingMember)
            else res.status(200).json({msg : 'You are not invited in any projects yet'})
        } catch (error) {
            res.status(500).json(error)
        }
    }

   static async postMsg(req, res) {
       try {
           let found = await Project.findByIdAndUpdate(req.params.projectId, {$push: {messageList: {message : req.body.message, userId : req.authenticatedUser.id, date : new Date()}}}, {new : true}).populate({path : 'messageList.userId', model : 'User'}).exec()
           res.status(200).json(found)
       } catch (error) {
            res.status(500).json(error)
       }
   }
}

module.exports = ProjectController