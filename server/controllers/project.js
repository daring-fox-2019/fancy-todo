const Project = require('../models/Project');

class ProjectController {

  static getAllProjects(req, res, next) {
    Project.find()
      .then((projects) => {
        res.status(200).json({
          message: 'FETCHED',
          projects,
        });
      })
      .catch((error) => {
        next(error);
      });
  };

  static postCreateProject(req, res, next) {
    const ownerId = req.authenticated.id;

    const {
      name,
      description
    } = req.body;

    const newProject = new Project({
      name,
      description,
      ownerId,
    });
    
    newProject.save()
      .then((project) => {
        res.status(201).json({
          message: 'CREATED',
          project,
        });
      })
      .catch((error) => {
        next(error);
      });
  };

  static putEditProjectById(req, res, next) {
    const { id } = req.params;
    const { 
      name,
      description
    } = req.body;

    const updates = {
      name,
      description
    };

    for(let key in updates) {
      if(String(updates[key]) == 'null' ) {
        delete updates[key];
      };
    }

    Project.findByIdAndUpdate(id, updates)
      .then((updated) => {
        res.status(200).json({
          message: 'UPDATED',
          project: updated,
        });
      })
      .catch((error) => {
        next(error);
      });
  };

  static deleteProjectById(req, res, next) {
    const { id } = req.params;
    
    Project.findById(id)
      .then((project) => {
        return project.remove()
      })
      .then(() => {
        res.status(200).json({
          message: 'DELETED',    
        });
      })
      .catch((error) => {
        next(error);
      })
  };

};

module.exports = ProjectController;
