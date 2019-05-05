const User = require("../models/user");
const Todo = require("../models/todo");
const Project = require("../models/project");
const jwt = require("../helpers/jwt-helper");

module.exports =  {
  authentication: function(req, res, next) {
    try {
      req.authenticatedUser = jwt.verify(req.headers.token);
      // console.log(req.authenticatedUser)

      User.findById(req.authenticatedUser.id)
        .then((user) => {
          if (user) {
            // console.log(user);
            next();
          } else {
            res.status(401).json({ message: "You need to login first" });
          }
        })
        .catch((err) => {
          next(err);
        });

    } catch (err) {
      console.log(err)
      res.status(401).json({ message: "You need to login first" });
    }
  },

  authorization: function(req, res, next) {
    // console.log("AUTHORIZATION");
    // console.log(req.params);

    if (req.params.projectId === "undefined") {
      Todo.findOne({ _id: req.params.todoId })
        .then(todo => {
          if (String(todo.userId) === req.authenticatedUser.id) {
            next();
          } else {
            res.status(401).json({ message: "You have no access to do that" });
          }
        });

    } else {

      Project.findOne({ _id: req.params.projectId })
        .then((project) => {
          console.log(project.members);

          let isAuthorized = false;

          project.members.forEach((member) => {
            if (String(member) === req.authenticatedUser.id) {
              isAuthorized = true;
            }
          });

          if (isAuthorized) {
            next();
          } else {
            res.status(401).json({ message: "You have no access to do that" });
          }
        })
    }
  }
}