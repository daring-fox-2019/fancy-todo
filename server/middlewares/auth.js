const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');
const Project = require('../models/Project');
const Todo = require('../models/Todo');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginMethod = (req, res, next) => {
  if(req.body.type === 'google') {
    const { id_token } = req.body;

    client.verifyIdToken({
      idToken: id_token,
      audience : process.env.GOOGLE_CLIENT_ID,
    })
      .then((response) => {
        req.googleUser = response.getPayload();
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else if(req.body.type === 'regular') {
    next();
  } else {
    next(new Error('We can\'t verify your request'));
  };
};

const userAuthentication = (req, res, next) => {
  try {
    if(!req. headers.authorization) {
      throw new Error('Unauthorized');
    } else if(req.headers.authorization.split(' ')[0] !== 'Bearer') {
      throw new Error('Unauthorized');
    }
    const decode = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

    User.findById(decode.id)
    .then((user) => {
      if(user) {
        req.authenticated = decode;
        next();
        } else {
          throw new Error('User not found');
        };
      })
      .catch((error) => {
        next(error);
      });
  }
  
  catch(error) {
    next(error);
  };
};

const todoOwnership = (req, res, next) => {

};

const projectOwnership = (req, res, next) => {

};

module.exports = {
  loginMethod,
  userAuthentication,
  todoOwnership,
  projectOwnership,
};