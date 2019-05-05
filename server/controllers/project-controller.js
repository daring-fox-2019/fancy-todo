const Project = require("../models/project");
const User = require("../models/user");

class ProjectController {
  static getProjects(req, res, next) {
    console.log("getProjects");

    User.findOne({ _id: req.authenticatedUser.id })
      .populate({
        path: "projects",
        options: { sort: { name: 1 } }
      })
      .then((user) => {
        console.log("getProjects success");
        // console.log(user);
        res.status(200).json(user.projects);
      })
      .catch((err) => {
        next(err);
      });
  }

  static getProject(req, res, next) {
    console.log("getProject");
    Project.findOne({ _id: req.params.id })
      .populate({
        path: "members",
        options: { sort: { username: 1 } }
      })
      .populate({
        path: "creator",
        select: "username",
      })
      .then((project) => {
        console.log("getProject success");
        // console.log(project);
        res.status(200).json(project);
      })
      .catch((err) => {
        next(err);
      });
  }

  static createProject(req, res, next) {
    console.log("createProject");
    // console.log(req.body);
    // console.log(req.authenticatedUser.id);

    const newProject = {
      name: req.body.name,
      creator: req.authenticatedUser.id,
      members: [req.authenticatedUser.id],
    };

    let createdProject = null;

    Project.create(newProject)
      .then((data) => {
        console.log("createProject success");
        // console.log(data);
        createdProject = data;
        return User.findOne({ _id: req.authenticatedUser.id });
      })
      .then((user) => {
        user.projects.push(createdProject._id);
        user.save((err) => { if (err) return err; });
        res.status(201).json(createdProject);
      })
      .catch((err) => {
        next(err);
      })
  }

  static updateProject(req, res, next) {
    console.log("updateProject");
    const updatedProject = { name: req.body.name };
    const options = { new: true, useFindAndModify: false };

    Project.findByIdAndUpdate(req.params.id, updatedProject, options)
      .then((project) => {
        console.log("updateProject success");
        // console.log(project);
        res.status(200).json(project);
      })
      .catch((err) => {
        next(err);
      });
  }

  static updateProjectMembers(req, res, next) {
    console.log("updateProjectMembers");
    // console.log(req.params);
    // console.log(req.authenticatedUser);
    let project = null;
    Project.findById(req.params.projectId).populate("members")
      .then((data) => {
        console.log("success");
        // console.log(data);
        project = data;
        return User.findOne({ username: req.body.name });
      })
      .then((user) => {
        let isDuplicate = false;
        let err = {};

        if (!user) {
          err = { status: 400, message: `User does not exist`}
          next(err);
          return;
        }

        project.members.forEach((member) => {
          if (member._id.toString() === user._id.toString()) {
            isDuplicate = true;
            err = { status: 400, message: `${member.username} is already a member`}
          }
        })

        if (isDuplicate) {
          next(err);
        } else {
          project.members.push(user._id);
          project.save((err) => { if (err) return err; });
          // console.log(user);
          user.projects.push(req.params.projectId);
          user.save((err) => { if (err) return err; });
          res.status(200).json(project);
        }
      })
      .catch((err) => {
        next(err);
      })
  }

  static deleteProject(req, res, next) {
    Project.findOneAndDelete({ _id: req.params.id })
      .then((project) => {
        console.log("deleteProject");
        // console.log(project);
        res.status(200).json(project);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = ProjectController;