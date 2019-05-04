const project = require('../models/project')

class Project {
  static create(req, res) {
    let newProject = new project({
      name: req.body.name,
      owner: req.userId,
      members: [],
      todos: []
    })
    project.create(newProject)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json({ message: "create project failed", err: err })
      })
  }

  static findAll(req, res) {
    project.find({
      $or: [
        { owner: req.userId },
        { members: req.userId }
      ]
    })
      .populate('owner')
      .populate('members')
      .populate('todos')
      .then(data => {

        res.status(200).json({ message: "get task data success", data: data })
        // else res.status(404).json({message:"task data not found",data:data})
      })
      .catch(err => {
        res.status(500).json({ message: "get task data failed", err: err })
      })
  }

  static findOne(req, res) {
    project.findById(req.params.id)
      .populate("userId")
      .populate('owner')
      .populate('members')
      .populate('todos')
      .then(data => {
        if (data) res.status(200).json({ message: "get task data success", data })
        else res.status(404).json({ message: "task data not found", data })
      })
      .catch(err => {
        res.status(500).json({ message: "get task data failed", err: err })
      })
  }

  static update(req, res) {
    let updateproject = {
      name: req.body.name,
      description: req.body.description,
      due_date: req.body.due_date,
    }
    project.findByIdAndUpdate(req.params.id, updateproject, { new: true })
      .then(data => {
        res.status(200).json({ message: "Update Success", data })
      })
      .catch(err => {
        res.status(500).json({ message: "update task failed", err: err })
      })
  }


  static delete(req, res) {
    project.deleteOne({ _id: req.params.id })
      .then(data => {
        res.status(200).json({ message: "Delete Success" })
      })
      .catch(err => {
        res.status(500).json({ message: "delete task failed", err: err })
      })
  }

  static addMember(req, res) {
    project.findOne({ members: req.body.user })
      .then(data => {
        if (data) {
          res.status(400).json({ msg: "Sudah terdaftar" })
        } else {
          return project.findOneAndUpdate({
            _id: req.params.id
          }, {
              $push: {
                members: req.body.user
              }
            }, { new: true })
        }
      })
      .then(data => {
        return project.findOne({ _id: data._id })
          .populate('owner')
          .populate('members')
          .populate('todos')
      }).then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
      })
  }

  static deleteMember(req, res) {
    project.update({
      _id: req.params.id
    }, {
        $pull: {
          members: req.body.userId
        }
      })
      .then(data => {
        res.status(201).json({ msg: "Delete success" })
      })
      .catch(err => {
        res.status(500).json({ err })
      })
  }
}

module.exports = Project