const User = require('../models/user')
const crypt = require('../helpers/crypt')
const jwt = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');

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
      async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload['email'];
        const name = payload['name'];

        User
          .findOne({email: email})
          .then(user => {
            if(user) {
              let token = jwt.sign({
                email: user.email,
                name: user.name,
                role: user.role
              }, process.env.JWT_SECRET)

              res.status(200).json({token: token, _id: user._id, email: user.email, name: user.name})
            }
            else {
              return User.create({
                email: email,
                name: name,
                password: crypt.hashPassword('pass1234'),
              })
            }
          })
          .then(user => {
            let token = jwt.sign({
              email: user.email,
              name: user.name,
              role: user.role
            }, process.env.JWT_SECRET)

            res.status(200).json({token: token, _id: user._id, email: user.email, name: user.name})
          })
          .catch(err => [
            res.status(500).json(err)
          ])
      }
      verify().catch(error => {
          console.log(error);
          
          res.status(500).json(error)
      });
    }
}

module.exports = UserController