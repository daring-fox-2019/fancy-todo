const moment = require('moment');

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
          select: ['name', 'description', 'date', 'status'],
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
      date,
    } = req.body;

    const newTodo = new Todo({
      name,
      description,
      date: moment(date, 'MM-DD-YYYY'),
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
      date,
      status,
    } = req.body;

    const updates = {
      name,
      description,
      date,
      status,
    };

    for(let key in updates) {
      if(String(updates[key]) == 'undefined') {
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
    let userId = '';
    const { projectId } = req.params;
    const { email } = req.body;

    User.findOne({ email })
      .then((user) => {
        if(user) {
          userId = user._id;
          return Project.findByIdAndUpdate(projectId, { $push: { members: user._id } }, { new: true })
        } else {
          throw new Error('User not found');
        }
      })
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
