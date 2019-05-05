const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("../helpers/bcryptjs-helper");
const jwt = require("../helpers/jwt-helper");
const User = require("../models/user");

class UserController {
  static createUser(req, res, next) {
    User.create({
      username: req.body.username.toLowerCase(),
      password: bcrypt.hashSync(req.body.password),
    })
      .then((user) => {
        console.log(user);

        const token = jwt.sign({
          id: user._id,
          username: user.email,
        });

        req.headers.token = token;

        res.status(201).json({ token: token });
      })
      .catch((err) => {
        next(err);
      });
  }

  static login(req, res) {
    User.findOne({ username: req.body.username.toLowerCase() })
      .then(user => {
        if (!user) {
          res.status(401).json({ message: "Wrong username/password" });
          return;
        }

        const loggedIn = bcrypt.compareSync(req.body.password, user.password);
        if (!loggedIn) {
          res.status(401).json({ message: "Wrong username/password" });
          return;
        }

        const userData = {
          id: user._id,
          username: user.username
        };

        const token = jwt.sign(userData);

        res.status(200).json({
          message: `Welcome back, ${user.username}!`,
          token,
          userId: user._id,
        });
      })

      .catch((err) => {
        next(err);
      });
  }

  static googleLogin(req, res) {
    const CLIENT_ID = process.env.CLIENT_ID;
    const client = new OAuth2Client(CLIENT_ID);
    const token = req.headers.token;

    // console.log("REQ HEADERS")
    // console.log(req.headers);

    client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    .then(ticket => {
      const payload = ticket.getPayload();
      const userid = payload["sub"];
      // If request specified a G Suite domain:
      //const domain = payload['hd'];

      console.log(payload);
      console.log(userid);

      User.findOne({ username: payload.email })
        .then(data => {
          if (!data) {
            console.log("create")
            User.create({
              username: payload.email,
              password: bcrypt.genSaltSync(10),
            })
            .then(user => {
              console.log("sukses");
              console.log(user);
              const googleToken = jwt.sign({
                id: user._id,
                username: user.email,
              }, process.env.JWT_SECRET);

              res.status(201).json({
                message: `Welcome, ${user.email}!`,
                token: googleToken,
              })
            })

          } else {

            console.log("udah ada")
            console.log(data);

            const googleToken = jwt.sign({
              id: data._id,
              username: data.username,
            }, process.env.JWT_SECRET);
            
            console.log(googleToken);
            req.headers.token = googleToken;

            res.status(201).json({
              message: `Welcome, ${data.username}!`,
              token: googleToken,
            })
          }
        })

        .catch(err => {
          console.log("gagal");
          res.status(500).json({ message: "Google Sign in failed "});
        });
    })
  }

  static getUsers(req, res) {
    console.log("getUsers");

    User.find()
      .then((users) => {
        console.log("getUsers success");
        res.status(200).json(users);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserController;
