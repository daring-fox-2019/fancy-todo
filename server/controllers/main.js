const Project = require('../models/Project');
const Todo = require('../models/Todo');
const User = require('../models/User');

class MainController {
  
  static getProjectById(req, res, next) {
    const { projectId } = req.params;

    Project.findById(projectId)
      .populate(
        { 
          path: 'members',
          select: ['username', 'email'],
        })
        .populate(
        {
          path: 'todos',
          select: ['name', 'description'],
          populate: {
            path: 'userId',
            select: ['username', 'email'],
          },
        },
      )
        .then((project) => {
          res.status(200).json({
            message: 'FETCHED',
            project,
          });
        })
        .catch((error) => {
          next(error);
        });
  };

  static postCreateTodoInProject(req, res, next) {
    const { projectId } = req.params;
    const userId = req.authenticated.id;

    console.log(req.body)
    const {
      name,
      description,
    } = req.body;

    const newTodo = new Todo({
      name,
      description,
      userId,
    });
    console.trace(newTodo)

    newTodo.save()
      .then((todo) => {
        Project.update(
          { _id: projectId },
          { $push: { todos: todo._id } },
        )
          .exec();
          res.status(201).json({
            message: 'CREATED',
            todo,
          });
      })
      .catch((error) => {
        next(error);
      });
  };

  static putEditTodoInProjectById(req, res, next) {
    const { todoId } = req.params;

    const {
      name,
      description,
    } = req.body;

    const updates = {
      name,
      description,
      status,
    };

    for(let key in updates) {
      if(String(updates[key]) == 'null') {
        delete updates[key];
      };
    };

    Todo.findByIdAndUpdate(todoId, updates, { new: true })
      .then((updated) => {
        res.status(200).json({
          message: 'UPDATED',
          todo: updated,
        });
      })
      .catch((error) => {
        next(error);
      });
  };

  static deleteTodoInProjectById(req, res, next) {
    const { todoId } = req.params;

    Todo.findByIdAndDelete(todoId)
      .then(() => {
        res.status(200).json({ message: 'DELETED' });        
      })
      .catch((error) => {
        next(error);
      });
  };

  static patchAddMemberToProject(req, res, next) {
    const {
      projectId,
      userId
    } = req.params;

    Project.findByIdAndUpdate(projectId, { $push: { members: userId } }, { new: true })
      .then((updated) => {
        User.update(
          { _id: userId },
          { $push: { projects: projectId }},
        )
          .exec();
        res.status(200).json({
          message: 'UPDATED',
          project: updated,
        });
      })
      .catch((error) => {
        next(error);
      });
  };

};

module.exports = MainController;
