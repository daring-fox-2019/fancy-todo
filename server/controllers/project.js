const { Project } = require('../models')

class ControllerProject {
  static create(req, res) {
    let input = req.body
    let newProject = {
      
    }
    Project.create(newProject)
      .then(data => {
        res.status(201).json({ data })
      })
      .catch(err => res.status(500).json({ message: err.message }))
  }
  static findAll(req, res) {
    Project.find()
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => res.status(500).json({message: err.message}))
  }
  static findOne(req, res) {
    Project.findOne({_id: req.params.id})
      .then(project => {
        res.status(200).json(project)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
  static update(req, res) {
    Project.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })
    .then(project => {
      res.status(200).json(project)
    })
    .catch(err => res.status(500).json({message: err.message}))
  }
  static delete(req, res) {
    Project.findOneAndDelete({_id: req.params.id})
      .then(project => {
        const response = {
          message: 'Successfully deleted project.',
          id: req.params.id
        }
        res.status(200).json(response)
      })
      .catch(err => {res.status(500).json({message: err.message})})
  }
}

module.exports = ControllerProject