const Todo = require("../models/todo");
const User = require("../models/user");
const Projects = require("../models/project");

class TodoController {
  static getUserTodos(req, res, next) {
    console.log("getUserTodos");
    // console.log(req.params);

    if (req.params.projectId === "undefined") {
      User.findOne({ _id: req.authenticatedUser.id })
        .populate({
          path: "todos",
          options: { sort: { dueDate: 1 } }
        })
        .then((user) => {
          console.log("getUserTodos success");
          // console.log(user);
          res.status(200).json(user.todos);
        })
        .catch((err) => {
          next(err);
        });

    } else {

      User.findOne({ _id: req.authenticatedUser.id })
      .populate({
        path: "projects",
        match: { _id: req.params.projectId },
        populate: {
          path: "todos",
          options: { sort: { dueDate: 1 } }
        }
      })
      .then((user) => {
        console.log("getUserTodos success");
        // console.log(user.projects[0].todos);
        res.status(200).json(user.projects[0].todos);
      })
      .catch((err) => {
        next(err);
      });
    }
  }

  static getTodo(req, res, next) {
    Todo.findOne({ _id: req.params.id })
      .then((todo) => {
        if (!todo) {
          res.status(500).json({ message: "Todo doesn't exist" });
        } else {
          console.log("getTodo sukses");
          res.status(200).json(todo);
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static createTodo(req, res, next) {
    console.log("createTodo");

    const newTodo = {
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      userId: req.authenticatedUser.id,
    };

    console.log(req.body.projectId);
    let createdTodo = null;

    Todo.create(newTodo)
      .then((data) => {
        console.log("createTodo success");
        // console.log(data);
        createdTodo = data;
        return User.findOne({ _id: req.authenticatedUser.id });
      })
      .then((user) => {
        user.todos.push(createdTodo._id);
        user.save((err) => { if (err) return err; });
        return Projects.findOne({ _id: req.body.projectId })
      })
      .then((project) => {
        // console.log(project);
        if (!project) {
          res.status(201).json(createdTodo);
        } else {
          project.todos.push(createdTodo._id);
          project.save((err) => { if (err) return err; });
          res.status(201).json(createdTodo);
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static updateStatus(req, res, next) {
    console.log(req.params);
    if (req.body.status === "In Progress") {
      req.body.status = "Completed";
    } else {
      req.body.status = "In Progress";
    }

    const updatedStatus = {
      status: req.body.status,
    };

    Todo.updateOne({
      _id: (req.params.todoId)
    }, {
        $set: updatedStatus
      })
      .then((updatedTodoStatus) => {
        console.log("updateStatus success");
        console.log(updatedTodoStatus);
        res.status(200).json(updatedTodoStatus);
      })

      .catch((err) => {
        next(err);
      });
  }

  static updateTodo(req, res, next) {
    console.log(req.body);
    const { name, description, status, dueDate, role } = req.body;
    const updatedTodo = { name, description, status, dueDate, role };
    const options = { new: true, useFindAndModify: false };

    Todo.findByIdAndUpdate(req.params.id, updatedTodo, options)
      .then((data) => {
        console.log("updateTodo success");
        console.log(data);
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteTodo(req, res, next) {
    console.log("deleteTodo");
    console.log(req.params);
    let deletedTodo = null;

    Todo.findOneAndDelete({ _id: req.params.todoId })
      .then((data) => {
        console.log("deleteTodo success");
        deletedTodo = data;
        // console.log(data);
        return User.findOne({ _id: req.authenticatedUser.id })
      })
      .then((user) => {
        // console.log(user);

        user.todos = user.todos.filter(todo => todo.toString() !== req.params.todoId);
        user.save((err) => { if (err) return err; });
        res.status(200).json(deletedTodo);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = TodoController;
