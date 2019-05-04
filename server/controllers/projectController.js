const Project = require('../models/project')

class ProjectController {
    static findAll(req, res) {
        Project.find()
            .then(list => {
                res.status(200).json(list)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static findOne(req, res) {
        let id = req.params.id

        Project.find({_id: id})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static create(req, res) {
        let project = {
            name: req.body.name,
            description: req.body.description,
            owner: req.user._id
        }

        Project.create(project)
            .then(created => {
                res.status(201).json(created)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static update(req, res) {
        let updated = {}
        for(let key of Object.keys(req.body)) {
            updated[key] = req.body[key]
        }

        Project.findOneAndUpdate({_id: req.params.id}, updated, {new: true})
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static delete(req, res) {
        Project.findOneAndDelete({_id: req.params.id})
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }
 
    static addMember(req, res) {
        let newMemberID = req.body.id

        Project.findOneAndUpdate({_id: req.params.id}, {$push: {members: newMemberID}}, {new: true})
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    static removeMember(req, res) {
        let deletedMemberID = req.body.id

        Project.findOneAndUpdate(
            {_id: req.params.id},
            { $pull: { members : deletedMemberID }}, 
            {safe: true}
            )
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err);
            })

    }
}

module.exports = ProjectController