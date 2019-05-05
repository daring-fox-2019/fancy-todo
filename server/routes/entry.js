const express = require('express');

const controller = require('../controllers/entry');
const middleware = require('../middlewares/auth');

const router = express.Router();

const {
  loginMethod,
  userAuthentication,
} = middleware;

const {
  postRegister,
  postLogin,
  getUserById,
} = controller;

router.post('/register', postRegister);
router.post('/login', loginMethod, postLogin);
router.get('/home', userAuthentication, getUserById);

module.exports = router;
