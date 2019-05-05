const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User  = require('../models/User');
const { createAccessToken } = require('../helpers/auth');

class EntryController {

  static testMWare(req, res) {
    res.status(200).json({message: 'AUTHENTICATED WOOHOOO'});
  };

  static postRegister(req, res, next) {
    const {
      username,
      email,
      password,
    } = req.body;

    const newUser = new User({
      username,
      email,
      password,
    });

    newUser.save()
      .then((user) => {
        const token = createAccessToken({
          id: user._id,
          email: user.email,
        });

        res.status(201).json({
          message: 'REGISTERED',
          accessToken: token,
          userId: user._id,
        });
      })
      .catch((error) => {
        next(error);
      });
  };

  static postLogin(req, res, next) {
    if(req.googleUser) {
      const {
        email,
        name,
      } = req.googleUser;
      
      User.findOne({ email }) 
        .then((user) => {
          if(user) {
            const token = createAccessToken({
              id: user._id,
              email: user.email,
            });

            res.status(200).json({
              message: 'LOGGED IN',
              accessToken: token,
              userId: user._id,
            });
          } else {
              const username = name;
              const password = crypto.randomBytes(4).toString('hex');
              const newUser = new User({
                username,
                email,
                password,
              });

              newUser.save()
              .then((user) => {
                const token = createAccessToken({
                  id: user._id,
                  email: user.email,
                });
      
                res.status(200).json({
                  message: 'LOGGED IN',
                  accessToken: token,
                  userId: user._id,
                });
              });
          };
        })
        .catch((error) => {
          next(error);
        });
    } else {
      const {
        email,
        password,
      } = req.body;
  
      User.findOne({ email })
        .then((user) => {
          if(user && bcrypt.compareSync(password, user.password)) {
            const token = createAccessToken({
              id: user._id,
              email: user.email,
            });
  
            res.status(200).json({
              message: 'LOGGED IN',
              accessToken: token,
              userId: user._id,
            });
          } else {
            throw new Error('Wrong email/password');
          };
        })
        .catch((error) => {
          next(error);
        });
    };
  };

  static getUserById(req, res, next) {
    User.findById(req.authenticated.id)
      .populate(
        {
          path: 'projects',
          select: ['name', 'description', 'members', 'todos', 'ownerId'],
          populate: {
            path: 'todos'
          }
        },
      )
      .populate(
        {
          path: 'todos',
          select: ['name', 'description', 'status', 'date'],
        }
      )
      .then((user) => {
        const {
          username,
          email,
          projects,
          todos,
        } = user;

        res.status(200).json({
          message: 'FETCHED',
          user:{
            username,
            email,
            projects,
            todos,
          },
        });
      })
      .catch((error) => {
        next(error);
      });
  };

};

module.exports = EntryController;
