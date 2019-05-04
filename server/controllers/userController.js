const User = require('../models/user')
const crypt = require('../helpers/crypt')
const jwt = require('../helpers/jwt')

class UserController {
    static create(req, res) {
        let user = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
          };

          if(req.body.role) {
              user.role = req.body.role
          }
      
          User.create(user)
          .then(user => {
            res.status(201).json(user);
          })
          .catch(err => {
            if (err.errors.email) {
              res.status(409).json(err.errors.email.reason);
            } else if(err.errors.password) {
              res.status(409).json(err.errors.password.message);
            } else {
              res.status(500).json(err);
            }
          })
    }

    static login(req, res) {
        User
        .findOne({email: req.body.email})
        .then(user => {
            if (user) {
                if (crypt.comparePassword(req.body.password, user.password)) {
                    let signUser = {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };

                    let token = jwt.sign(signUser);
                    res.status(200).json({
                        token: token,
                        _id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    })
                }
            } else {
                res.status(500).json("User not found");
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static googleLogin(req, res) {

    }
}

module.exports = UserController